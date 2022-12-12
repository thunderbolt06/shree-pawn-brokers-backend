const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const pawnSchema = new Schema({
    id: { type: String, required: true, unique: true },
    principal: { type: Number, required: true },
    insertDate: { type: String, required: true},
    weight: { type: String, required: true }
});

pawnSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Pawn', pawnSchema);