import mongoose from "mongoose";

const quizAttemptsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    correct: {
        type: Number,
        required: true
    },
    incorrect: {
        type: Number,
        required: true
    },
    skipped: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    answerArray: {
        type: [Number],
        required: true
    }
}, {
    timestamps: true
})

export const QuizAttempts = mongoose.model("QuizAttempts", quizAttemptsSchema);