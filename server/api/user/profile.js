'use strict';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var empty = require('is-empty');
var trim = require('trim');
var utils = require('./../../utils/config.js');
var Validator = require('validatorjs');
var async = require('async');
var profile = {
	//Mobile registration function
	request: function (req, res) {
		try {
			var data = {
				"_id": req.body.user_id,
				"username": req.body.username,
				"mobile_number": req.body.mobile_number,
				"email": req.body.email,
				"dob": req.body.dob,
			};
			var rules = {
				"_id": 'required',
				"username": 'required|min:4',
				"mobile_number": 'required|min:10',
			};

			var validation = new Validator(data, rules);
			if (validation.passes() === false) {
				var result = { "response_code": "1", "message": "enter valid data", "result": {} };
				res.json(result);
			} else {
				MongoClient.connect(utils.setmydb(), function (err, db) {
					if (err) throw callback(err);
					var ObjectId = new ObjectID(req.body.user_id);
					var myquery = {
						"_id": ObjectId,
					};
					var newvalues = {
						"username": req.body.username,
						"mobile_number": req.body.mobile_number,
						"email": req.body.email,
						"dob": req.body.dob
					};
					db.collection("user").findOneAndUpdate(myquery,{$set:newvalues} , function(err, result) {
						if (err) throw err;
						db.close();
						var responsedata = { "response_code": "0", "message": "Successfully registered", "result": [result.value] };
						res.json(responsedata);
					});
				});

			}
		} catch (e) {
			console.log(e);
		}
	}
}
module.exports = profile;