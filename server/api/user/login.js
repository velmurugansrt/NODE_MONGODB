'use strict';
var MongoClient = require('mongodb').MongoClient;
var empty = require('is-empty');
var trim = require('trim');
var utils = require('./../../utils/config.js');
var Validator = require('validatorjs');
var async = require('async');
var login = {
	//Mobile registration function
	request: function (req, res) {
		try {
			var data = {
				username: req.body.username,
				password: req.body.password,
			};

			var rules = {
				username: 'required|min:4',
				password: 'required|min:4',
			};

			var validation = new Validator(data, rules);
			if (validation.passes() === false) {
				var result = { "response_code": "1", "message": "enter valid data", "result": {} };
				res.json(result);
			} else {
				MongoClient.connect(utils.setmydb(), function (err, db) {
					if (err) throw callback(err);
					db.collection("user").find(data).toArray(function (err, result) {
						if (err) throw console.log(err);
						db.close();
						if (result.length > 0) {
							var responsedata = { "response_code": "0", "message": "Successfully logged", "result": result };
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
module.exports = login;