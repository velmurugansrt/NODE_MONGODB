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
				"user_id":req.body.user_id,
				"todo_id":req.body.todo_id
			};

			var rules = {
				"user_id":'required',
				"todo_id":'required'
			};

			var validation = new Validator(data, rules);
			if (validation.passes() === false) {
				var result = { "response_code": "1", "message": "enter valid data", "result": {} };
				res.json(result);
			} else {
				MongoClient.connect(utils.setmydb(), function (err, db) {
					if (err) throw callback(err);
					var todo_ids=req.body.todo_id;
					var ObjectIds =[];
					for(var i in todo_ids){
						var ObjectId = new ObjectID(todo_ids[i]);
						ObjectIds.push(ObjectId)
					}
					var query = {
							"_id":{'$in':ObjectIds}
					};
					db.collection("todolist").remove(query,function (err, result) {
						if (err) throw console.log(err);
						if (result.result.n!="0" && result.result.ok=="1") {
							var query = {
								"user_id":req.body.user_id,
							};
							db.collection("todolist").find(query).toArray(function (err, result) {
								if (err) throw err;
								db.close();
								var responsedata = { "response_code": "0", "message": "Todo removed successfully", "result": result };
								res.json(responsedata);
							});
						} else {
							var responsedata = { "response_code": "1", "message": "Invalid todo", "result": [] };
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