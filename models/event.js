var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EventSchema = new Schema({
  name: {type: String, default: "Sample Cyber Career Fair", required: true},
  description: {type: String, default: "I am a sample description" },
  startTime: {type: Date, default: Date.now },
  endTime: {type: Date, default: Date.now },
  admin: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Event', EventSchema)

// var Event = mongoose.model('Event')
// e = new Event({name: "West Coast Cyber Career Fair", companies: ["537bb807f3b58b3747b5f7d6"]})
// e.save()