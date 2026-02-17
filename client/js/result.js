import { ApiService } from "./api-service.js";

document.addEventListener("DOMContentLoaded", () => {

    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    const correctAnswers = document.getElementsByClassName("correct-answers");
    const incorrectAnswers = document.getElementById("incorrect-answers");
    const skippedAnswers = document.getElementById("skipped-answers");
    const totalQuestions = document.getElementById("total-questions");
    const totalTime = document.getElementById("total-time");
    const averageTime = document.getElementById("average-time");
    const topicName = document.getElementById("topic-name");
    const topicDifficulty = document.getElementById("topic-difficulty");
    const feedbackHeader = document.getElementById("feedback-header");
    const feedbackPara = document.getElementById("feedback-para");
    const reviewBtn = document.getElementById("review-btn");
    const retryBtn = document.getElementById("retry-btn");
    const shareBtn = document.getElementById("share-btn");

    const fetchQuizData = async () => {
        try {
            showLoader();
            const response = await ApiService.get(`/quizAttempt/fetch/${quizId}`);
            if (!response) {
                return false;
            }

            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("");
        }
        finally {
            hideLoader();
        }
    }

    const populateValues = async () => {

        try {
            let quizData = await fetchQuizData();
            if (!quizData) {
                throw new Error();
            }

            let localCorrectAnswers = quizData.quizAttempt.correct;
            let localSkippedAnswers = quizData.quizAttempt.skipped;
            let localIncorrectAnswers = quizData.quizAttempt.incorrect;
            let localTotalTime = 0;
            let localAverageTime = 0;

            for (const elem of correctAnswers) {
                elem.textContent = localCorrectAnswers;
            }

            incorrectAnswers.textContent = localIncorrectAnswers;
            skippedAnswers.textContent = localSkippedAnswers;
            const totalQues = localIncorrectAnswers + localSkippedAnswers + localCorrectAnswers;
            totalQuestions.textContent = totalQues;
            topicName.textContent = quizData.quizAttempt.quiz.topic.topicName;
            topicDifficulty.textContent = quizData.quizAttempt.quiz.questions[0].difficulty;

            const percentage = ((localCorrectAnswers / (totalQues)) * 100);
            console.log(percentage);

            const remarks = [
                {
                    headers: "Outstanding Performance!",
                    para: "You demonstrated a high level of understanding and consistency. Your results place you among the top performers, showing strong mastery and effective execution."
                },
                {
                    headers: "Good Progress!",
                    para: "You met the expected standard. You show a basic to moderate level of understanding, with opportunities to improve accuracy and depth through further practice."
                },
                {
                    headers: "Needs Improvement!",
                    para: "You did not yet meet the expected standard. Focus on strengthening foundational skills and practicing regularly to improve future results."
                }
            ]

            if (percentage >= 80) {
                feedbackHeader.textContent = remarks[0].headers;
                feedbackPara.textContent = remarks[0].para;
            }
            else if (percentage >= 50) {
                feedbackHeader.textContent = remarks[1].headers;
                feedbackPara.textContent = remarks[1].para;
            }
            else {
                feedbackHeader.textContent = remarks[2].headers;
                feedbackPara.textContent = remarks[2].para;
            }
        } catch (error) {

        }

    }

    const navigateToReviewPage = () => {
        window.location.href = `/review?quizId=${quizId}`;
    }

    const navigateToHomePage = () => {
        window.location.href = "/";
    }

    const enableShareResults = () => {
        failureToast("This feature will be available soon.", "Not Available");
    }

    reviewBtn.addEventListener("click", navigateToReviewPage);
    retryBtn.addEventListener("click", navigateToHomePage);
    shareBtn.addEventListener("click", enableShareResults);

    populateValues();

})