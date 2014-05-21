var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EventSchema = new Schema({
  name: {type: String, default: "Cyber Career Fair", required: true},
  description: {type: String, default: "I am a description" },
  startTime: Date, 
  endTime: Date,
})

module.exports = mongoose.model('Event', EventSchema)

// var Event = mongoose.model('Event')
// e = new Event({name: "West Coast Cyber Career Fair", companies: ["537bb807f3b58b3747b5f7d6"]})
// e.save()