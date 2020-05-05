// Load mongoose
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the entity schema
const entitySchema = new Schema({
    name: String,
    type: String,
    source: String,
    start: Number,
    end: Number,
    docId: String,
    sentId: String,
    corpus: String
});

module.exports = mongoose.model('Entity', entitySchema);