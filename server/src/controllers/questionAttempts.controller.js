import { QuestionAttempts } from "../models/questionAttempts.model.js";
import { User } from "../models/user.model.js";
import { Question } from "../models/question.model.js";

const userAttempt = async (req, res) => {
    try {
        const { questionId, isCorrect } = req.body;
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ error: "Please provide user id" });
        }

        if (!questionId) {
            return res.status(400).json({ error: "Please provide question id" });
        }

        if (typeof isCorrect !== "boolean") {
            return res.status(400).json({ error: "Please provide isCorrect value" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(400).json({ error: "Question not found" });
        }

        const existingAttempt = await QuestionAttempts.findOne({ user: userId, question: questionId });

        if (!existingAttempt) {
            const newUserAttempt = await QuestionAttempts.create({
                user: userId, question: questionId, isCorrect
            })

            return res.status(201).json({ newUserAttempt, message: "User attempt created successfully" });
        }
        else {
            if (existingAttempt.isCorrect === false && isCorrect === true) {
                existingAttempt.isCorrect = true;
                await existingAttempt.save();
                res.status(200).json({ message: "Attempt updated to correct!" })
            }
        }

        res.status(200).json({ message: "Question already attempted" });
    } catch (error) {
        res.status(500).json({ error: "Unable to process question attempt" });
    }
}

export { userAttempt };