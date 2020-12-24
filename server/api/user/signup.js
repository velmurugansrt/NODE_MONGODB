'use strict';
var MongoClient = require('mongodb').MongoClient;
var empty = require('is-empty');
var trim = require('trim');
var utils = require('./../../utils/config.js');
var Validator = require('validatorjs');
var async = require('async');
var signup = {
	//Mobile registration function
	request: function (req, res) {
		try {
			var data = {
				username: req.body.username,
				password: req.body.password,
				repassword: req.body.repassword,
			};
			var rules = {
				username: 'required|min:4',
				password: 'required|min:4',
				repassword: 'required|min:4',
			};

			var validation = new Validator(data, rules);
			if (validation.passes() === false) {
				var result = { "response_code": "1", "message": "enter valid data", "result": {} };
				res.json(result);
			} else {
				if (req.body.repassword == req.body.password) {
					MongoClient.connect(utils.setmydb(), function (err, db) {

						db.collection("user").find({ username: req.body.username }).toArray(function (err, result) {
							if (err) throw console.log(err);
							if (result.length > 0) {
								var responsedata = { "response_code": "1", "message": "Existing user!", "result": [] };
								res.json(responsedata);
							} else {
								var query = {
									username: req.body.username,
									password: req.body.password
								};
								db.collection("user").insert(query, function (err, result) {
									if (err) throw console.log(err);
									db.close();
									var responsedata = { "response_code": "0", "message": "Successfully registered", "result": result.ops };
									res.json(responsedata);
								});
							}
						});


					});

				} else {
					var result = { "response_code": "1", "message": "Password Mismatch", "result": {} };
					res.json(result);
				}

			}
		} catch (e) {
			console.log(e);
		}
	}
}
module.exports = signup;