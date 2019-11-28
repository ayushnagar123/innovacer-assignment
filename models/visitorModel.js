var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var visitorSchema = new Schema({
	'name' : String,
	'email': String,
	'phone' : String,
	'inTime' : Date,
	'outTime' : Date,
	'host' : String
});

module.exports = mongoose.model('visitor', visitorSchema);
