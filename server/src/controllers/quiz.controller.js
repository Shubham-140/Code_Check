import mongoose from "mongoose";
import { Question } from "../models/question.model.js";
import { Topic } from "../models/topic.model.js";
import { userSetting } from "../models/userSetting.model.js";
import { Quiz } from "../models/quiz.model.js";

const generateQuiz = async (req, res) => {
    try {
        const { topicId } = req.body;
        const userId = req.user.userId;

        if (!topicId) {
            return res.status(400).json({ error: "Please provide topic" });
        }

        const existingTopic = await Topic.findById(topicId);

        if (!existingTopic) {
            return res.status(404).json({ error: "Topic not found" });
        }

        const userSettings = await userSetting.findOne({ user: userId });
        const quizData = await Question.aggregate([
            {
                $match: {
                    topic: new mongoose.Types.ObjectId(topicId),
                    difficulty: userSettings.difficulty,
                }
            },
            {
                $sample: {
                    size: userSettings.questionsPerQuiz
                }
            }
        ]);

        if (quizData.length < userSettings.questionsPerQuiz) {
            return res.status(500).json({ error: "Unable to generate quiz at the moment." });
        }

        const generatedQuiz = await Quiz.create({
            topic: topicId,
            questions: quizData.map((ques) => ques._id)
        })

        if (!generatedQuiz) {
            throw new Error();
        }

        const populatedQuiz = await Quiz.findById(generatedQuiz._id)
            .populate('questions')
            .populate('topic');

        res.status(200).json({ quizId: generatedQuiz._id, populatedQuiz, userSettings })
    } catch (error) {
        res.status(500).json({ error: "Unable to generate quiz at the moment." })
    }
}

export { generateQuiz };