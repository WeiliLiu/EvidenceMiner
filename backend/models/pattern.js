// Load mongoose
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the entity schema
const patternSchema = new Schema({
    sentId: String,
    metaPattern: String,
    instances: [String],
    sentenceExtraction: String,
    docId: String,
    corpus: String
});

module.exports = mongoose.model('Pattern', patternSchema);