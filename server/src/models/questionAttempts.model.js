import mongoose from "mongoose";

const questionAttemptsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    isCorrect: {
        type: Boolean,
        enum: [true, false],
        required: true
    }
})

export const QuestionAttempts = mongoose.model("QuestionAttempts", questionAttemptsSchema);