import mongoose from "mongoose"
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name: {
        required: true,
        minlength: 2,
        type: String,
        maxlength: 25,
        trim: true
    },
    username: {
        required: true,
        unique: true,
        type: String,
        minlength: 2,
        maxlength: 25,
        index: true,
        lowercase: true,
        trim: true
    },
    password: {
        required: true,
        type: String,
        select: false
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    }
}, {
    timestamps: true
})

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return;
    }
    try {
        this.password = await bcrypt.hash(this.password, 8);
    } catch (error) {
        throw error;
    }
})

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", UserSchema);