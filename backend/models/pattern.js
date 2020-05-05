// Load mongoose
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the entity schema
const pattern = new Schema({
    sentId: String,
    metaPattern: String,
    instances: [String],
    sentenceExtraction: String,
    docId: String
});

module.exports = mongoose.model('patterns', pattern);