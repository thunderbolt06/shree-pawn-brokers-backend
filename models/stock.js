const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const stockSchema = new Schema({
    product: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
});

stockSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Stock', stockSchema);