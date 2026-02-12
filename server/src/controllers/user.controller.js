import { User } from "../models/user.model.js";

const getUser = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user: user });
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch user" });
    }
}

const editUserDetails = async (req, res) => {
    try {
        const { password, role, ...userDetails } = req.body;
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ error: "Please provide User ID" });
        }

        const existingUser = await User.findOne({ _id: userId });

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const existingUserObj = existingUser.toObject();

        for (const elem in userDetails) {
            if (existingUserObj.hasOwnProperty(elem) && userDetails.hasOwnProperty(elem)) {
                existingUser[elem] = userDetails[elem];
            }
        }

        await existingUser.save();

        res.status(200).json({ message: "User Details updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Unable to update details at the moment" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ error: "Invalid User ID" });
        }

        const existingUser = await User.findByIdAndDelete(userId);

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully!" })
    } catch (error) {
        res.status(500).json({ error: "Unable to delete user at the moment" })
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user?.userId).select('-password');
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Unable to validate user at the moment" })
    }
}

export { getUser, editUserDetails, deleteUser, getMe };