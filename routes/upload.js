var crypto = require('crypto')
var fs = require('fs')

exports.init = function(app) {
  app.post('/upload', function(req, res) {
    console.log (req.files)
    fs.readFile(req.files.file.path, function (err, data) {
      var filename = crypto.createHash('md5').update(req.files.file.path).update(new Date().toISOString()).digest('hex');
      var newPath = "public/uploads/"+filename;
      var shortPath = "/uploads/"+filename
      fs.writeFile(newPath, data, function (err) {
        if (err) {
          return console.log("writingFile", err, newPath)
        }
        res.send(shortPath);
      });
    });
  })
}