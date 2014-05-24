var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer')
var crypto = require('crypto');
var fs = require('fs')
var baucis = require('baucis');

var app = express();
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/ccf')

app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(multer({ dest: './uploads/'}))
app.use(cookieParser());

var Company = require('./models/company')
var Entry = require('./models/entry')
var Event = require('./models/event')
var User = require('./models/user')

baucis.rest('Entry');
baucis.rest('Event');
baucis.rest('User');
baucis.rest('Company')

app.use('/api', baucis());

app.post('/upload', function(req, res) {
  console.log (req.files)
  fs.readFile(req.files.file.path, function (err, data) {
    var filename = crypto.createHash('md5').update(req.files.file.path).update(new Date().toISOString()).digest('hex');
    var newPath = "public/uploads/"+filename;
    var shortPath = "/uploads/"+filename
    fs.writeFile(newPath, data, function (err) {
      if (err) {
        return winston.error("writingFile", err, newPath)
      }
      res.send(shortPath);
    });
  });
})



module.exports = app;
