const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the entity schema
const sentenceSchema = new Schema({
    pmid: {
        type: String,
        default: ""
    },
    sentId: {
        type: String,
        required: true
    },
    entities: {
        type: [{
            name: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            source: {
                type: String,
                default: "Unkown"
            },
            start: {
                type: Number,
                required: true
            },
            end: {
                type: Number,
                required: true
            }
        }],
        default: []
    },
    section: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        default: ""
    },
    prevSent: {
        type: String,
        default: ""
    },
    nextSent: {
        type: String,
        default: ""
    },
    pubDate: {
        type: String,
        default: ""
    },
    patterns: {
        type: [{
            
        }]
    }
});

module.exports = mongoose.model('Pattern', patternSchema);