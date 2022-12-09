const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    option1: {
        type: String,
        required: true,
        trim: true,
    },
    option2: {
        type: String,
        required: true,
        trim: true,
    },
    option3: {
        type: String,
        required: true,
        trim: true,
    },
    option4: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    quesImage: {
        type: String,
        default: "NA",
        trim: true
    },
    quesVideo: {
        type: String,
        default: "NA",
        trim: true
    },
    equation: {
        type: String,
        default: "NA",
        trim: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);