// import mongoose from "mongoose";

// const userStatSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//         unique: true,
//         index: true
//     },
//     score: {
//         type: Number,
//         default: 0
//     },
//     questionsSolved: {
//         type: Number,
//         default: 0
//     },
//     questionsAttempted: {
//         type: Number,
//         default: 0
//     }
// })

// export const UserStat = mongoose.model("UserStat", userStatSchema);