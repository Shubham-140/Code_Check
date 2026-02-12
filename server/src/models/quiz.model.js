import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required:true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required:true
    }]
})

export const Quiz = mongoose.model("Quiz", quizSchema);