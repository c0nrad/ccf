var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var baucis = require('baucis');

var app = express();

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/ccf')

app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());


var Company = require('./models/company')
var Entry = require('./models/entry')
var Event = require('./models/event')
var User = require('./models/user')

var eventController = baucis.rest('Entry');
baucis.rest('Event');
baucis.rest('User');
baucis.rest('Company')

app.use('/api', baucis());


eventController.request(function (request, response, next) {
  request.baucis.incoming(function (context, callback) {
    console.log(context.incoming)
    callback(null, context);
  });
  next();
});


module.exports = app;
