import { generateJWT } from "../middlewares/jwt.middleware.js";
import { User } from "../models/user.model.js";
import { userSetting } from "../models/userSetting.model.js";

const registerUser = async (req, res) => {
    try {
        const { name, username, password: pass, confirmPassword } = req.body;

        if (!name?.trim() || !username?.trim() || !pass?.trim() || !confirmPassword?.trim()) {
            return res.status(400).json({ error: "Please fill all details" });
        }

        if (pass !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({ error: "Username already taken" });
        }

        const newUser = await User.create({
            name, username, password: pass
        })

        const { password, ...userWithoutPassword } = newUser.toObject();

        try {
            const userSettings = await userSetting.create({
                user: newUser._id
            });

            return res.status(201).json({ user: userWithoutPassword, message: "User created successfully!", userSettings });
        } catch (error) {
            await User.findByIdAndDelete(newUser._id);
            return res.status(500).json({ error: "Unable to register at the moment" });
        }
    } catch (error) {
        res.status(500).json({ error: "Unable to register user at the moment" })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password: inputPass } = req.body;

        if (!username?.trim()) {
            return res.status(400).json({ error: "Username is required" });
        }
        if (!inputPass?.trim()) {
            return res.status(400).json({ error: "Password is required" });
        }

        const user = await User.findOne({ username }).select("+password");

        if (!user) {
            return res.status(404).json({ error: "Invalid Credentials" });
        }

        const isPasswordCorrect = await user.comparePassword(inputPass);

        if (!isPasswordCorrect) {
            return res.status(404).json({ error: "User not found" });
        }

        const jwt = generateJWT(user._id, user.role);

        const { password, ...userWithoutPassword } = user.toObject();

        res.status(200).json({ user: userWithoutPassword, token: jwt });
    } catch (error) {
        res.status(500).json({ error: "Unable to login at the moment." })
    }
}

export { registerUser, loginUser };