import { Topic } from "../models/topic.model.js";

const generateTopic = async (req, res) => {
    try {
        const { topic: topicName, topicCode, description } = req.body;

        if (!topicName?.trim()) {
            return res.status(400).json({ error: "Please provide topic name" });
        }

        if (!topicCode?.trim()) {
            return res.status(400).json({ error: "Please provide topic code" });
        }

        if (!description?.trim()) {
            return res.status(400).json({ error: "Please provide description for the topic" });
        }

        const existingTopicName = await Topic.findOne({ topicName });
        const existingTopicCode = await Topic.findOne({ topicCode });

        if (existingTopicName) {
            return res.status(409).json({ error: "Topic name already exists" })
        }
        if (existingTopicCode) {
            return res.status(409).json({ error: "Topic code already exists" })
        }

        const newTopic = await Topic.create({ topicName, topicCode, description });
        res.status(201).json({
            message: "Topic created successfully!",
            topic: newTopic,
            description: description
        });
    } catch (error) {
        res.status(500).json({ error: "Unable to generate topic at the moment" })
    }
}

const fetchTopics = async (_, res) => {
    try {
        const topics = await Topic.find({}).lean();
        res.status(200).json({ topics });
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch topics at the moment." })
    }
}

export { generateTopic, fetchTopics };