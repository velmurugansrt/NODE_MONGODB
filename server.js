'use strict';
var express = require('express');
var app = express();
const path = require('path');
var bodyParser = require('body-parser');
var routes = require('./server/');

app.use(bodyParser.json());
app.use(routes);

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

var server = app.listen(9000, function () {
    console.log('Node server is running..');
});



