import { Question } from "../models/question.model.js";
import { Topic } from "../models/topic.model.js";

const generateQuestion = async (req, res) => {
    try {
        const { topicId, description, difficulty, correctOption, options, codeSnippet } = req.body;

        if (!topicId) {
            return res.status(400).json({ error: "Please provide topic" });
        }

        if (!description?.trim() || !difficulty?.trim() || !Array.isArray(options)) {
            return res.status(401).json({ error: "Please check question data" });
        }

        if (!(difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard')) {
            return res.status(401).json({ error: "Please select correct difficulty" });
        }

        if (typeof correctOption !== "number" || correctOption < 0 || correctOption > 3) {
            return res.status(401).json({ error: "Please select correct option number" });
        }

        if (options.length !== 4) {
            return res.status(401).json({ error: "4 options must be present" });
        }

        const existingTopic = await Topic.findById(topicId);

        if (!existingTopic) {
            return res.status(400).json({ error: "Topic ID doesn't exist" });
        }

        const question = await Question.create({
            topic: topicId, description, difficulty, correctOption, options, codeSnippet
        })

        res.status(201).json({ message: "Question created successfully!", question })
    } catch (error) {
        res.status(500).json({ error: "Unable to generate question at the moment." });
    }
}

export { generateQuestion };