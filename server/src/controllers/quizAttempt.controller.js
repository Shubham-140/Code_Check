import { QuizAttempts } from "../models/quizAttempts.model.js";
import { Quiz } from "../models/quiz.model.js";

const saveQuizAttempt = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { quizId, timeTaken, answers } = req.body;

        if (!quizId) {
            return res.status(400).json({ error: "No quiz ID found" });
        }

        const quiz = await Quiz.findById(quizId).populate('questions');

        if (!Array.isArray(answers)) {
            return res.status(400).json({ error: "Invalid answers format" });
        }

        let correct = 0;
        let incorrect = 0;
        let skipped = 0;
        let totalQuestions = quiz.questions.length;

        for (let i = 0; i < quiz.questions.length; i++) {
            if (answers[i] === null || answers[i] === undefined) {
                skipped++;
            }
            else if (answers[i] == quiz.questions[i].correctOption) {
                correct++;
            }
            else {
                incorrect++;
            }
        }

        while (answers.length !== quiz.questions.length) {
            answers.push(null);
        }

        if (timeTaken === undefined || typeof timeTaken !== 'number') {
            return res.status(400).json({ error: "Please provide correct quiz attempt data" });
        }

        const generatedQuizAttempt = await QuizAttempts.create({
            user: userId, quiz: quizId, correct, incorrect, skipped, timeTaken, totalQuestions, answerArray:answers
        })

        if (!generatedQuizAttempt) {
            throw new Error();
        }

        return res.status(201).json({ generatedQuizAttempt });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

const fetchAttemptedQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.user.userId;

        if (!quizId) {
            return res.status(400).json({ error: "Quiz Id is required" });
        }

        const quizAttempt = await QuizAttempts.findOne({ quiz: quizId, user: userId })
            .populate({
                path: 'quiz',
                populate: { path: 'questions topic' }
            })
            ;

        if (!quizAttempt) {
            return res.status(404).json({ error: "No Quiz Attempted" });
        }

        return res.status(200).json({ quizAttempt });
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch quiz details at the time" });
    }
}

const fetchQuizAttemptedHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;

        if (page < 1 || limit < 1) {
            return res.status(400).json({ error: "Please provide valid page and limit" });
        }

        const skip = (page - 1) * limit;

        const attemptedQuizHistory = await QuizAttempts.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .populate({
                path: 'quiz',
                select: 'topic',
                populate: {
                    path: 'topic',
                    select: 'topicName'
                }
            });

        const totalDocuments = await QuizAttempts.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalDocuments / limit);

        res.status(200).json({ attemptedQuizHistory, pages: totalPages });
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch quiz history at the moment." });
    }
}

export { saveQuizAttempt, fetchAttemptedQuiz, fetchQuizAttemptedHistory };