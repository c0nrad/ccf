var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  name: String,
  email: String, 
  resume: String,
  entries: [{type: Schema.Types.ObjectId, ref:"Entry"}]
})

module.exports = mongoose.model('User', UserSchema)

// var User = mongoose.model('User')
// u = new User({name: "Stuart Larsen"})
// u.save()
