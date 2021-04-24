// src/windows/main/main.page.js

let xlsx = require('xlsx');
const path = require('path');
console.log('_xlsx :' + xlsx.readFile);

const ipcRenderer = require('electron').ipcRenderer;

// const { ipcRenderer, BrowserWindow } = require('electron')
let result = [];
let Utilities = {};
Utilities.readXLFile = (filePath, sheet = 0) => {
	let wb = xlsx.readFile(filePath),
		data = xlsx.utils.sheet_to_row_object_array(wb.Sheets[wb.SheetNames[sheet]], { raw: false });
	return data;
};
function readFile(xldata) {
	for (let x = 0; x < xldata.length; x = x + 3) {
		console.log('x : ' + x);
		let head = xldata[x];
		let content = xldata[x + 1];
		console.log(JSON.stringify(head));
		console.log(JSON.stringify(content));
		// console.log(JSON.stringify(Object.keys(head)));
		let headKeys = Object.keys(head);
		let contentKeys = Object.keys(content);
		let timestamp = headKeys[0].split(/[\s,]+/).join();
		// let timestamp = headKeys[0].split(' ')
		console.log('time : ' + JSON.stringify(timestamp));
		let tmpObj = {};
		for (let i = 1; i < headKeys.length; i++) {
			for (let j = 1; j < contentKeys.length; j++) {
				// console.log(':' + head[headKeys[i]]);
				// console.log(':' + content[contentKeys[i]]);
				tmpObj[head[headKeys[i]]] = content[contentKeys[i]];
				// result[head[headKeys[i]]] = content[contentKeys[i]];
			}
		}
		console.log('res 1 : ' + JSON.stringify(tmpObj));

		// Object.keys(head).forEach((key1) => {
		// 	Object.keys(content).forEach((key2) => {
		// 		tmpObj[head[key1]] = content[key2];
		// 	});
		// });

		result.push(tmpObj);

		console.log('res 3: ' + JSON.stringify(result));
	}
	// let head = xldata[0];
	// let content = xldata[1];

	return result;
}

function processFile(xldata) {
	let head = xldata[0];
	let content = xldata[1];
	let result = [];
	console.log(JSON.stringify(head));
	console.log(JSON.stringify(content));
	console.log(JSON.stringify(Object.keys(head)));
	let headKeys = Object.keys(head);
	let contentKeys = Object.keys(content);
	let timestamp = headKeys[0].split(/[\s,]+/).join();
	console.log('time : ' + JSON.stringify(timestamp));
	return timestamp;
	// let timestamp = headKeys[0].split(' ')
	// for(let i =1 ;i<headKeys.length ; i++){
	//     for(let j =1 ;j<contentKeys.length ; j++){
	//         result[head[headKeys[i]]] = content[contentKeys[i]]
	//     }
	// }
	// Object.keys(head).forEach((key1) => {
	//     Object.keys(content).forEach((key2) => {
	//     result[head[key1]] = content[key2]
	// })
	// });
	// return result
}
function saveMany() {
	ipcRenderer.send('save-many', tmp);
}
function syncAll() {
	let xldata = Utilities.readXLFile(path.join(__dirname, 'src', 'Database.xls'));
	console.log('FINAL : ', readFile(xldata));
}
function syncBtn() {
	let xldata = Utilities.readXLFile(path.join(__dirname, 'src', 'Database.xls'));
	let ts = processFile(xldata);
	let tmp = ts.split(',');
	console.log('ts : ' + ts);
	let goldWt = tmp[3].replace(/[^0-9.]+/g, '');
	document.getElementById('GoldPercentInput').value = goldWt;

	var p = document.querySelector('#inputForm');
	p.classList.add('column');
	fetchImage();
}
function removePrevImg() {
	document.querySelectorAll('img').forEach((it) => it.remove());
}

function fetchImage() {
	removePrevImg();
	let imgPath = path.join(__dirname, 'src', 'imageDB', 'neclace3.jpg');
	console.log(imgPath);
	let ele = document.createElement('img');
	ele.src = imgPath;
	ele.width = '400';
	ele.height = '500';
	// let img = `<img id="goldImg" src="${imgPath}"  width="400" height="500">`
	document.getElementById('goldImgDiv').appendChild(ele);
}
function estimateReport(event) {
	event.preventDefault();
	let cname = document.getElementById('nameInput').value;
	let mobile = document.getElementById('mobileInput').value;
	let email = document.getElementById('emailInput').value;
	let less = document.getElementById('LessInput').value;
	let rate = document.getElementById('rateInput').value;
	let gross = document.getElementById('GrossWtInput').value;
	let result = document.getElementById('GoldPercentInput').value;
	console.log(less);
	console.log(rate);
	console.log(gross);
	console.log(result);

	let netwt = gross - less;
	let purity = result * netwt;
	let amount = purity * rate;
	console.log('netwt' + netwt);
	console.log('purity' + purity);
	console.log('amount' + amount);
	document.getElementById('report').style.display = 'block';

	document.querySelector('#nameval').innerHTML = cname;
	document.querySelector('#mobileVal').innerHTML = mobile;
	document.querySelector('#emailVal').innerHTML = email;

	document.querySelector('#GoldPercentVal').innerHTML = gross;

	document.querySelector('#grossVal').innerHTML = gross;
	document.querySelector('#lessVal').innerHTML = less;
	document.querySelector('#rateVal').innerHTML = rate;
	document.querySelector('#purityVal').innerHTML = purity;
	document.querySelector('#amtVal').innerHTML = amount;
	document.querySelector('#netwtVal').innerHTML = netwt;

	document.getElementById('inputform').style.display = 'none';
}
function pageLoaded() {
	document.getElementById('printBtn').addEventListener('click', (event) => {
		let s = document.querySelector('#syncBtn');
		let p = document.querySelector('#printBtn');
		s.classList.add('noPrint');
		p.classList.add('noPrint');
	});
	document.getElementById('syncBtn').addEventListener('click', () => {
		syncAll(() => {
			saveMany();
		});
	});
	document.getElementById('estimate').addEventListener('click', (event) => {
		estimateReport(event);
	});
}

// console.log(ipcRenderer.sendSync('synchronous-message', 'sync ping'));
document.addEventListener('DOMContentLoaded', pageLoaded);

// // Async message handler
ipcRenderer.on('report-print-reply', (event, arg) => {
	console.log('arg print ' + arg);
	setTimeout(() => {
		let s = document.querySelector('#syncBtn');
		let p = document.querySelector('#printBtn');
		s.classList.remove('noPrint');
		p.classList.remove('noPrint');
	}, 250);
});

// // Async message sender
// ipcRenderer.send('asynchronous-message', 'async ping');
