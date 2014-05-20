var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EntrySchema = new Schema({
})

module.exports = mongoose.model('Entry', EntrySchema)


// class Entry(ndb.Model):
//   name = ndb.StringProperty()
//   email = ndb.StringProperty()
//   resume = ndb.BlobKeyProperty()
//   event = ndb.KeyProperty()
//   companies = ndb.StringProperty(repeated=True)
//   date = ndb.DateTimeProperty(auto_now_add=True)