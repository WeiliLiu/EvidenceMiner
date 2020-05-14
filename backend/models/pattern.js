const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the entity schema
const patternSchema = new Schema({
    metaPattern: {
        type: String,
        require: true
    },
    instances: {
        type: [String],
        required: true
    },
    count: Number,
    sentCount: {
        type: Number, 
        required: true
    },
    docCount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Pattern', patternSchema);