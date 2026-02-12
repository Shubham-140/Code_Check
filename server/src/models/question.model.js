import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        required: true,
        enum: ['easy', 'medium', 'hard'],
        type: String
    },
    correctOption: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    },
    options: {
        type: [String],
        required: true
    },
    codeSnippet: {
        type: String,
        unique: true,
        sparse: true 
    }
})

export const Question = mongoose.model("Question", questionSchema);