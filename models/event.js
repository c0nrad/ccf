var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EventSchema = new Schema({
  name: String
})

module.exports = mongoose.model('Event', EventSchema)

// var Event = mongoose.model('Event')
// e = new Event({name: "West Coast Cyber Career Fair"})
// e.save()