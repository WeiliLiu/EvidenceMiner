const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the entity schema
const entitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
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

module.exports = mongoose.model('Entity', entitySchema);