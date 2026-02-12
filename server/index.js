import app from "./src/app.js";
import connectDB from "./src/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Some error occurred", err);
  });
