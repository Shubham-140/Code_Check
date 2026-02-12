import mongoose from "mongoose";

const connectDB = async () => {

    const db = mongoose.connection;

    db.on('connected', () => {
            console.log("Database connected successfully!")
        })

        db.on('disconnected', () => {
            console.log("Database disconnected!")
        })

        db.on('error', () => {
            console.log("Error connecting to database!", error)
        })

    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`);
    } catch (error) {
        console.log("Something went wrong with Database connection!", error);
    }

}

export default connectDB;