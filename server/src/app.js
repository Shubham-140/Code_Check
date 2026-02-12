import express from "express";
const app = express();
import cors from "cors";

app.use(cors());

app.use(express.json({
    limit: '16kb'
}))



import AuthRoute from "./routes/auth.route.js";
import UserRoute from "./routes/user.route.js";
import QuestionRoute from "./routes/question.route.js";
import TopicRoute from "./routes/topic.route.js";
import QuestionAttemptsRoute from "./routes/questionAttempts.route.js";
// import UserStatRoute from "./routes/userstat.route.js";
import QuizRoute from "./routes/quiz.route.js";
import userSettingRoute from "./routes/userSetting.route.js";
import quizAttemptRoute from "./routes/quizAttempt.route.js";

app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/question", QuestionRoute);
app.use("/api/v1/topic", TopicRoute);
app.use("/api/v1/questionAttempt", QuestionAttemptsRoute);
// app.use("/api/v1/userstat", UserStatRoute);
app.use("/api/v1/quiz", QuizRoute);
app.use("/api/v1/userSetting", userSettingRoute);
app.use("/api/v1/quizAttempt", quizAttemptRoute);

export default app;