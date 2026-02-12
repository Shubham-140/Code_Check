import { userSetting } from "../models/userSetting.model.js";

const changeUserSettings = async (req, res) => {

    try {
        const { difficulty, timePerQuestion, questionsPerQuiz, isDarkMode } = req.body;
        const userId = req.user.userId;

        
        if (difficulty !== undefined && !["easy", "medium", "hard"].includes(difficulty)) {
            return res.status(400).json({ error: "Please use correct setting options" });
        }
        
        if (timePerQuestion !== undefined && typeof timePerQuestion !== 'number') {
            return res.status(400).json({ error: "Please use correct setting options" });
        }
        
        if (questionsPerQuiz !== undefined && typeof questionsPerQuiz !== 'number') {
            return res.status(400).json({ error: "Please use correct setting options" });
        }
        
        if (isDarkMode !== undefined && typeof isDarkMode !== 'boolean') {
            return res.status(400).json({ error: "Please use correct setting options" });
        }
        
        const updatedSettings = {};
        
        if (difficulty !== undefined) {
            updatedSettings.difficulty = difficulty;
        }
        if (timePerQuestion !== undefined) {
            updatedSettings.timePerQuestion = timePerQuestion;
        }
        if (questionsPerQuiz !== undefined) {
            updatedSettings.questionsPerQuiz = questionsPerQuiz;
        }
        if (isDarkMode !== undefined) {
            updatedSettings.isDarkMode = isDarkMode;
        }
        
        const savedSettings = await userSetting.findOneAndUpdate(
            { user: userId },
            updatedSettings,
            { new: true, runValidators: true }
        )

        if (!savedSettings) {
            return res.status(404).json({ error: "User settings not found" });
        }

        return res.status(200).json({ message: "Settings activated successfully", savedSettings })
    } catch (error) {
        res.status(500).json({ error: "Can't activate settings at the moment." })
    }

}

const getUserSettings = async (req, res) => {
    try {
        const userId = req.user.userId;

        const userSettings = await userSetting.findOne({ user: userId });
        if (!userSettings) {
            return res.status(404).json({ error: "User settings doesn't exist, please create a new account" });
        }

        res.status(200).json({ userSettings });
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch user settings at the moment." })
    }
}

export { changeUserSettings, getUserSettings };