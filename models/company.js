var mongoose = require('mongoose')
var Schema = mongoose.Schema
var randtoken = require('rand-token');

var CompanySchema = new Schema({
  name: {type: String, required: true, default: "Company Name"},
  description: {type: String, default: "Company Description"},
  logo: {type: String, default: ""},
  token: {type: String, default: function() {
    return randtoken.generate(40)
  }},
  event: {type: Schema.Types.ObjectId, ref: 'Event'}
})

module.exports = mongoose.model('Company', CompanySchema)

// var c = mongoose.model('Company')
// c = new c({name: "A2B", description: "We sell bike sharing systems", logo: "http://a2bbikeshare.com/img/logo.png" })
// c.save()