var mongoose       = require('mongoose');
var Schema = mongoose.Schema;

var phonebookSchema = new Schema({
	name: String,
	title: String,
	email: String,
	phone: String,
	address: String,
	company: String
});

module.exports = mongoose.model('Phonebook', phonebookSchema);