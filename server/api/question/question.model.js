import mongoose from 'mongoose';

var QuestionSchema = new mongoose.Schema({
    question: {
        title: String,
        detail: String,
        imageUrl: String
    },
    response: {
        title: String,
        detail: String,
        imageUrl: String
    },
    level: {
        type: Number,
        default: 0
    },
    failures: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Question', QuestionSchema);
