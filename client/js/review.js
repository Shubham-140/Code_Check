import { ApiService } from "./api-service.js";

document.addEventListener("DOMContentLoaded", () => {

    const questionContainer = document.getElementById("question-container");
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

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

    const loadReview = async () => {

        try {
            let html = "";
            let quizData = await fetchQuizData();

            if (!quizData) {
                throw new Error();
            }

            const questions = quizData.quizAttempt.quiz.questions;
            console.log(questions);
            const attemptedQuestions = quizData.quizAttempt.answerArray;

            questions.forEach((question, srNo) => {
                html += `
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <!-- Question Header -->
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
                        <div class="flex items-center text-white">
                            <div class="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                <span class="text-xl font-bold">Q${srNo + 1}</span>
                            </div>
                            <div>
                               <h2 class="text-xl font-bold">${escapeHtml(question.description)}</h2>
                            </div>
                        </div>
                    </div>
    
                    <div class="p-6">
                        <div
                            class="${!question?.codeSnippet?.trim() ? "hidden" : ""} mb-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                           <pre class="text-gray-800 dark:text-gray-300 font-mono text-lg overflow-x-auto">${escapeHtml(question?.codeSnippet || "")}</pre>
                        </div>
    
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Option A -->
                            <div
                                class="flex items-center p-5 border-2 ${question.correctOption === 0 ?
                        "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20" : attemptedQuestions[srNo] == 0 ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700"} rounded-xl">
                                <div
                                    class="h-10 w-10 rounded-lg ${question.correctOption === 0 ? "bg-green-100 dark:bg-green-800" : attemptedQuestions[srNo] == 0 ? "bg-red-100 dark:bg-red-800" : "bg-gray-100 dark:bg-gray-700"} flex items-center justify-center mr-4">
                                    <span class="font-bold ${question.correctOption === 0 ? "text-green-700 dark:text-green-300" : attemptedQuestions[srNo] == 0 ? "text-red-700 dark:text-red-300" : "text-gray-700 dark:text-gray-300"}">A</span>
                                </div>
                                <div class="flex-1">
                                    <div class="text-gray-900 dark:text-white">${escapeHtml(question.options[0])}</div>
                                </div>
                            </div>
    
                            <!-- Option B -->
                            <div class="flex items-center p-5 border-2 ${question.correctOption === 1 ?
                        "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20" : attemptedQuestions[srNo] == 1 ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700"} rounded-xl">
                                <div
                                    class="h-10 w-10 rounded-lg ${question.correctOption === 1 ? "bg-green-100 dark:bg-green-800" : attemptedQuestions[srNo] == 1 ? "bg-red-100 dark:bg-red-800" : "bg-gray-100 dark:bg-gray-700"} flex items-center justify-center mr-4">
                                    <span class="font-bold ${question.correctOption === 1 ? "text-green-700 dark:text-green-300" : attemptedQuestions[srNo] == 1 ? "text-red-700 dark:text-red-300" : "text-gray-700 dark:text-gray-300"}">B</span>
                                </div>
                                <div class="flex-1">
                                    <div class="text-gray-900 dark:text-white">${escapeHtml(question.options[1])}</div>
                                </div>
                            </div>
    
                            <!-- Option C -->
                            <div class="flex items-center p-5 border-2 ${question.correctOption === 2 ?
                        "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20" : attemptedQuestions[srNo] == 2 ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700"} rounded-xl">
                                <div
                                    class="h-10 w-10 rounded-lg ${question.correctOption === 2 ? "bg-green-100 dark:bg-green-800" : attemptedQuestions[srNo] == 2 ? "bg-red-100 dark:bg-red-800" : "bg-gray-100 dark:bg-gray-700"} flex items-center justify-center mr-4">
                                    <span class="font-bold ${question.correctOption === 2 ? "text-green-700 dark:text-green-300" : attemptedQuestions[srNo] == 2 ? "text-red-700 dark:text-red-300" : "text-gray-700 dark:text-gray-300"}">C</span>
                                </div>
                                <div class="flex-1">
                                    <div class="text-gray-900 dark:text-white">${escapeHtml(question.options[2])}</div>
                                </div>
                            </div>
    
                            <!-- Option D -->
                            <div class="flex items-center p-5 border-2 ${question.correctOption === 3 ?
                        "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20" : attemptedQuestions[srNo] == 3 ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700"} rounded-xl">
                                <div
                                    class="h-10 w-10 rounded-lg ${question.correctOption === 3 ? "bg-green-100 dark:bg-green-800" : attemptedQuestions[srNo] == 3 ? "bg-red-100 dark:bg-red-800" : "bg-gray-100 dark:bg-gray-700"} flex items-center justify-center mr-4">
                                    <span class="font-bold ${question.correctOption === 3 ? "text-green-700 dark:text-green-300" : attemptedQuestions[srNo] == 3 ? "text-red-700 dark:text-red-300" : "text-gray-700 dark:text-gray-300"}">D</span>
                                </div>
                                <div class="flex-1">
                                    <div class="text-gray-900 dark:text-white">${escapeHtml(question.options[3])}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
            })

            questionContainer.innerHTML = html;
        } catch (error) {

        }

    }

    loadReview();

})