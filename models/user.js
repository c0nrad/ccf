var mongoose = require('mongoose')
var Schema = mongoose.Schema

var grades = "Freshman Sophmore Junior Senior".split(' ')

var UserSchema = new Schema({
  name: String,
  email: String, 
  resume: String,
  major: String,
  grade: {type: String, enum: grades},
  firstLogin: {type: Date}
})

module.exports = mongoose.model('User', UserSchema)

// var User = mongoose.model('User')
// u = new User({name: "Stuart Larsen", email: "poptarts4liffe@gmail.com"})
// u.save()
