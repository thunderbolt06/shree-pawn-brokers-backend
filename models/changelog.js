const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const stockSchema = new Schema({
    time: { type: String, required: true, unique: true  },
    product: { type: String, required: true },
    operation: { type: String, required: true },
    changeValue: { type: String, required: true },
    oldValue: { type: String, required: true },
    crosschecked: { type: Boolean, required: true },
});

stockSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Changelog', stockSchema);