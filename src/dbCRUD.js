let pageViewModel = require('./mongoDB/model.js');
var async = require('async');

module.exports = {
	isDataExists(dateLs) {
		pageViewModel.find({ loanDate: { $in: dateLs } }, function(err, docs) {
			// docs.forEach(element => {
			console.log('DATA  founded : ' + JSON.stringify(docs));
			// });
			return docs;
			// res.json({data : {"pageVisitCount" : docs}});
		});
	},
	bunchInsert() {
		pageViewModel
			.updateMany(query, update, { upsert: true })
			.then(function() {
				console.log('Many Data inserted..'); // Success
			})
			.catch(function(error) {
				console.log(error); // Failure
			});
	},
	insertMany(insertLs) {
	 var bulk = pageViewModel.collection.initializeOrderedBulkOp();
	 insertLs.forEach(function(item) {
        bulk.find({ "_id": item._id }).upsert().updateOne({
          "$setOnInsert": { "name": item.name }
        });
      });
		pageViewModel
			.insertMany(insertLs)
			.then(function() {
				console.log('Many Data inserted'); // Success
			})
			.catch(function(error) {
				console.log(error); // Failure
			});
	},
	async saveToDb(loanDate, loanTime, goldWt, name, email, mobile) {
		console.log('test save...');
		let id = `${loanDate},${loanTime}`;
		let result = await this.getbyId(id);
		console.log(' : ' + JSON.stringify(result));
		if (!result) {
			let db_instance = new pageViewModel({
				id: id,
				loanDate: loanDate,
				loanTime: loanTime,
				goldWt: goldWt,
				customerName: name,
				mobile: mobile,
				email: email,
				created_at: new Date()
			});
			// Save the new model instance, passing a callback
			db_instance.save(function(err) {
				if (err) console.log('ERR  : ' + JSON.stringify(err));
				else console.log('first data saved to db');
			});
		} else {
			console.log('update ...qry ');
			this.updateById(id);
		}
	},
	getbyId(id) {
		return pageViewModel.findOne({ id }, function(err, docs) {
			// docs.forEach(element => {
			console.log('DATA ; ' + JSON.stringify(docs));
			// });
			return docs;
			// res.json({data : {"pageVisitCount" : docs}});
		});
	},
	updateById(id) {
		var myquery = { id };
		var newvalues = { $set: { name: 'Mickey', email: 'Canyon@123' } };
		dbo.collection('customers').updateOne(myquery, newvalues, function(err, res) {
			if (err) throw err;
			console.log('1 document updated');
			db.close();
		});
	},
	incPageView() {
		console.log('START..');

		pageViewModel.updateOne({ id: 1 }, { $inc: { pageVisitCount: 1 } }, { upsert: true }, function(err, data) {
			if (err) throw err;
			console.log('COUNT INC DONE :' + JSON.stringify(data));
		});
	}
};
