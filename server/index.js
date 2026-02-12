import app from "./src/app.js";
import connectDB from "./src/db.js";
import dotenv from "dotenv";

dotenv.config();

connectDB().then(() => {
    app.listen(process.env.PORT, '0.0.0.0', () => {
        console.log(`App is running at ${process.env.PORT || 8000}`);
    })
})
.catch(() => {
    console.log("Some error occurred");
})