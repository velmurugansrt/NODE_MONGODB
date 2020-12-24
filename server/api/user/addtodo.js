'use strict';
var MongoClient = require('mongodb').MongoClient;
var empty = require('is-empty');
var trim = require('trim');
var utils = require('./../../utils/config.js');
var Validator = require('validatorjs');
var async = require('async');
var addtodo = {
	//Mobile registration function
	request: function (req, res) {
		try {
			var data = {
				"user_id": req.body.user_id,
				"title": req.body.title,
				"date": req.body.date,
				"description": req.body.description
			};
			var rules = {
				"user_id": 'required',
				"title": 'required',
				"date": 'required',
				"description": 'required'
			};

			var validation = new Validator(data, rules);
			if (validation.passes() === false) {
				var result = { "response_code": "1", "message": "enter valid data", "result": {} };
				res.json(result);
			} else {
				MongoClient.connect(utils.setmydb(), function (err, db) {
					if (err) throw callback(err);
					var myquery = {
						"user_id": req.body.user_id,
						"title": req.body.title,
						"date": req.body.date,
						"description": req.body.description,
					};
					db.collection("todolist").insert(myquery, function (err, result) {
						if (err) throw err;
						var data = {
							"user_id": req.body.user_id
						}
						db.collection("todolist").find(data).toArray(function (err, result) {
							if (err) throw err;
							db.close();
							var responsedata = { "response_code": "0", "message": "Added successfully", "result": result };
							res.json(responsedata);
						});
					});
				});

			}
		} catch (e) {
			console.log(e);
		}
	}
}
module.exports = addtodo;