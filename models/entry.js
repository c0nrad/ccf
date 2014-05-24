var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EntrySchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  companies: {type: [{type: Schema.Types.ObjectId, ref: "Company"}], default: []},
  event: {type: Schema.Types.ObjectId, ref: "Event" }, 
  dateCreated: {type: Date, default: Date.now},
  resume: {type: String, default: ""}
})

module.exports = mongoose.model('Entry', EntrySchema)


// class Entry(ndb.Model):
//   name = ndb.StringProperty()
//   email = ndb.StringProperty()
//   resume = ndb.BlobKeyProperty()
//   event = ndb.KeyProperty()
//   companies = ndb.StringProperty(repeated=True)
//   date = ndb.DateTimeProperty(auto_now_add=True)