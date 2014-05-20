var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  name: String
})

module.exports = mongoose.model('User', UserSchema)

// var User = mongoose.model('User')
// u = new User({name: "Stuart Larsen"})
// u.save()