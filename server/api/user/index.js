'use strict';
var express = require('express');
var router = express.Router();
var login = require('./login.js');
var signup = require('./signup.js');
var profile = require('./profile.js');
var remove = require('./remove.js');
var removetodo= require('./removetodo.js');
var addtodo= require('./addtodo.js');
var todolist= require('./todolist.js');

router.post('/signup', signup.request);
router.post('/addtodo', addtodo.request);
router.post('/login', login.request);
router.post('/profile', profile.request);
router.post('/removetodo', removetodo.request);
router.post('/remove', remove.request);
router.post('/todolist', todolist.request);

module.exports = router;