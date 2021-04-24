const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
let dbCrud = require('./src/dbCRUD.js');

const express = require('express');
const expressApp = express();

const mongoose = require('mongoose');
const uri =
	'mongodb+srv://loanEstimator:goldIsAu@cluster0.djg0n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('MongoDB Connected');
		// dbCrud.saveToDb();
	})
	.catch((err) => console.log(err));

expressApp.listen(2000, () => console.log('server is up and listening'));
// process.on('uncaughtException', (err) => {
//     console.error('====== Exception Thrown as ====== :' + JSON.stringify(err));
//     // console.error(err);
// });

expressApp.use(function(err, req, res, next) {
	console.log('===== Exception catched in middleware =====!!' + JSON.stringify(err.stack));
	console.error(err);
});

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: false,
			nodeIntegration: true
		}
	});
	win.loadFile('report.html');
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

function printReport(sender) {
	let win = BrowserWindow.getFocusedWindow();
	win.webContents.print({}, (success, failureReason) => {
		if (!success) {
			console.log(': ' + failureReason);
			sender.send('report-print-reply', 'print failed');
		} else {
			console.log('Print Initiated');
			sender.send('report-print-reply', 'print success');
		}
	});
}
ipcMain.on('print-report', (event, arg) => {
	console.log('print report in main page');
	printReport(event.sender);
});

ipcMain.on('save-to-db', (event, arg) => {
	console.log('save to db' + typeof arg);
	arg = arg.toString();
	console.log('save to db 2' + typeof arg);

	let tmp = arg.split(',');
	// dbCrud.saveToDb(tmp[0],tmp[1],tmp[3],"","", "");
});
ipcMain.on('save-many', (event, arg) => {
	console.log('save to db' + typeof arg);
	arg = arg.toString();
	console.log('save to db 2' + JSON.parse(arg));

	// let tmp = arg.split(',');
	// dbCrud.saveToDb(tmp[0],tmp[1],tmp[3],"","", "");
});
// Event handler for synchronous incoming messages
// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg)

//   // Synchronous event emmision
//   event.returnValue = 'sync pong'
// })
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
