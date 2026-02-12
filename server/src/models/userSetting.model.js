import mongoose from "mongoose";

const userSettingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
        unique: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "easy"
    },
    timePerQuestion: {
        type: Number,
        enum: [15, 30, 45, 60],
        default: 30
    },
    questionsPerQuiz: {
        type: Number,
        default: 10,
        enum: [10, 15, 20, 25, 30, 35, 40, 45, 50]
    },
    isDarkMode: {
        type: Boolean,
        default: true,
        enum: [false, true]
    }
}, { timestamps: true });

export const userSetting = mongoose.model("userSetting", userSettingSchema);