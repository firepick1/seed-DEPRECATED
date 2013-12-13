var express = require('express');
var fs = require('fs');
var app = express();
var __appdir = process.env.SEED_APP ? process.env.SEED_APP : process.cwd();
app.use(express.static(__appdir + "/src/www"));
app.use(express.bodyParser());
var path=require('path');
var tsr = require('typescript-require');
var seedmodule = require(__appdir + "/src/www/js/seedmodule.js");
var state = new seedmodule.State();

console.log(__appdir);

respondJSON = function(res, obj) {
	if (typeof obj === 'undefined') {
		obj = "undefined";
	}
	var json = JSON.stringify(obj);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', json.length);
  res.end(json);
};

app.get('/rest/state', function(req, res){
  state.message = new Date().toJSON().toString();
  state.stateId++;
  respondJSON(res, state);
});

app.get('/rest/path', function(req, res){
  var msg = "__appdir is " + __appdir;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', msg.length);
  res.end(msg);
});

var port = 80;
app.listen(port);
console.log('SEED_APP listening on port ' + port);
