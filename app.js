var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer')
var crypto = require('crypto');
var fs = require('fs')
var passport = require('passport')
var baucis = require('baucis');
var session = require('express-session')

var app = express();
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/ccf')

app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(multer({ dest: './uploads/'}))
app.use(cookieParser("i4ms0s0s0s01337 jab00ty"));
app.use(session())
app.use(passport.initialize());
app.use(passport.session());

var UserRoutes = require('./routes/user')
UserRoutes.init(app)

var ApiRoutes = require('./routes/api')
ApiRoutes.init(app)

var UploadRoutes = require('./routes/upload')
UploadRoutes.init(app)

module.exports = app;
