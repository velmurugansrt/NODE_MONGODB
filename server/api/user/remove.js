'use strict';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var empty = require('is-empty');
var trim = require('trim');
var utils = require('./../../utils/config.js');
var Validator = require('validatorjs');
var async = require('async');
var remove = {
	//Mobile registration function
	request: function (req, res) {
		try {
			var data = {
				"_id": req.body.user_id,
			};

			var rules = {
				_id: 'required',
			};

			var validation = new Validator(data, rules);
			if (validation.passes() === false) {
				var result = { "response_code": "1", "message": "enter valid data", "result": {} };
				res.json(result);
			} else {
				MongoClient.connect(utils.setmydb(), function (err, db) {
					if (err) throw callback(err);
					
					var ObjectId = new ObjectID(req.body.user_id);
					var query = {
						"_id":ObjectId,
					};
					db.collection("user").remove(query,function (err, result) {
						if (err) throw console.log(err);
						db.close();
						if (result.result.n=="1" && result.result.ok=="1") {
							var responsedata = { "response_code": "0", "message": "User Removed!", "result": [] };
							res.json(responsedata);
						} else {
							var responsedata = { "response_code": "1", "message": "Invalid user", "result": [] };
							res.json(responsedata);
						}
					});
				});
			}
		} catch (e) {
			console.log(e);
		}
	}
}
module.exports = remove;