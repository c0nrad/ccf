var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EntrySchema = new Schema({
})

module.exports = mongoose.model('Entry', EntrySchema)
