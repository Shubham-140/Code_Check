import { ApiService } from "./api-service.js"

document.addEventListener("DOMContentLoaded", () => {
    let time_limit = null;
    let remainingTime = null;
    let difficulty = "";
    let quiz = "";
    let currentQuestion = 1;

    try {
        quiz = JSON.parse(localStorage.getItem("quiz"));
        time_limit = quiz?.userSettings?.timePerQuestion;
        remainingTime = JSON.parse(localStorage.getItem("remaining-time"));
        difficulty = quiz?.userSettings?.difficulty;
        console.log(quiz);
        currentQuestion = JSON.parse(localStorage.getItem("current-question")) || 1;

        if (quiz === null) {
            throw new Error("Invalid localStorage state");
        }
    }
    catch (error) {
        localStorage.removeItem("quiz");
    }

    const topicNameDOM = document.getElementsByClassName("topic-name");
    const currentQuestionDOM = document.getElementsByClassName("current-question");
    const remainingTimeDOM = document.querySelectorAll(".remaining-time-dom");
    const difficultyDom = document.getElementsByClassName("difficulty-dom");
    const totalQuestionsDOM = document.getElementsByClassName("total-questions-dom")
    const skipBtn = document.querySelectorAll(".skip-btn");
    const nextBtn = document.querySelectorAll(".next-btn");
    let questions = [];
    let attemptedOptions = [];
    let currentOption = null;
    let timerRef = null;
    let selectedCurrentOption = null;

    if (!quiz) {
        window.location.href = "home.html";
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    const updateRemainingTime = () => {
        timerRef = setInterval(() => {
            remainingTime--;

            for (let i = 0; i < remainingTimeDOM.length; i++) {
                remainingTimeDOM[i].textContent = remainingTime;
            }

            localStorage.setItem(
                'remaining-time',
                JSON.stringify(remainingTime)
            );

            if (remainingTime === 0) {
                skipQuestion("time-up")
                remainingTime = time_limit;
            }
        }, 1000);
    }

    const updateCurrentQuestion = () => {
        for (const elem of currentQuestionDOM) {
            elem.textContent = currentQuestion;
        }
    }

    for (const elem of topicNameDOM) {
        elem.textContent = quiz?.populatedQuiz?.topic?.topicName;
    }

    for (const elem of difficultyDom) {
        elem.textContent = difficulty;
    }

    for (const elem of totalQuestionsDOM) {
        elem.textContent = quiz?.userSettings?.questionsPerQuiz;
    }

    const saveQuiz = async () => {
        try {
            const response = await ApiService.post("/quizAttempt/save", { timeTaken: time_limit, quizId: quiz.quizId, answers: attemptedOptions });

            if (!response) {
                throw new Error();
            }

            return response.data;
        } catch (error) {
            console.error("");
        }
    }

    const skipQuestion = async (str) => {

        if (str === "next") {
            if (currentOption === null) {
                failureToast("Please select an option or click on Skip", "Option not selected");
                return;
            }

            attemptedOptions.push(currentOption);
            currentOption = null;
        }
        else if (str === "time-up") {
            attemptedOptions.push(selectedCurrentOption);
            selectedCurrentOption = null;
        }
        else {
            attemptedOptions.push(null);
        }

        if (currentQuestion >= quiz?.userSettings?.questionsPerQuiz) {
            try {
                const attemptedQuizData = await saveQuiz();
                if (!attemptedQuizData) {
                    console.log(attemptedQuizData)
                    throw new Error();
                }
                console.log(attemptedQuizData);
                successToast("Quiz submitted successfully", "Operation completed");
                localStorage.removeItem("current-question");

                setTimeout(() => {
                    window.location.href = `result.html?quizId=${quiz?.quizId}`;
                }, 3000);
            } catch (error) {
                console.error("Something went wrong");
            }
        }

        if (currentQuestion < quiz?.userSettings?.questionsPerQuiz) {
            currentQuestion++;
            updateCurrentQuestion();
            loadQuestions();
        }
    };

    for (const elem of skipBtn) {
        elem.addEventListener("click", () => skipQuestion("skip"));
    }

    for (const elem of nextBtn) {
        elem.addEventListener("click", () => skipQuestion("next"));
    }

    function loadQuestions() {
        try {
            if (currentQuestion > 1) {
                localStorage.setItem("current-question", JSON.stringify(currentQuestion));
            }
            if (currentQuestion > quiz?.userSettings?.questionsPerQuiz) {
                return;
            }
            remainingTime = time_limit + 1;
            const firstQues = quiz?.populatedQuiz?.questions[currentQuestion - 1];

            // Mobile HTML
            const mobileHTML = `
            <!-- Question Text -->
            <div class="mb-6">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">${escapeHtml(firstQues?.description || "")}</h3>
                <div class="${!firstQues?.codeSnippet?.trim() ? "hidden" : ""} bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <pre class="text-gray-800 dark:text-gray-300 font-mono text-sm overflow-x-auto">${escapeHtml(firstQues?.codeSnippet || "")}</pre>
                </div>
            </div>

            <!-- Options (1 per row) -->
            <div class="space-y-3" id="loaded-options-container-mobile">
                ${['A', 'B', 'C', 'D'].map((letter, index) => `
                    <div class="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer" data-option="${index}">
                        <div class="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                            <span class="font-bold text-gray-700 dark:text-gray-300 text-sm">${letter}</span>
                        </div>
                        <div class="flex-1">
                            <div class="text-gray-900 dark:text-white text-sm">${escapeHtml(firstQues?.options[index])}</div>
                        </div>
                        <div class="ml-3 h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600" data-selected="option" data-number="${index}"></div>
                    </div>
                `).join('')}
            </div>
        `;

            // Tablet HTML
            const tabletHTML = `
            <!-- Question Text -->
            <div class="mb-8">
               <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">${escapeHtml(firstQues?.description || "")}</h3>
                <div class="${!firstQues?.codeSnippet?.trim() ? "hidden" : ""} bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <pre class="text-gray-800 dark:text-gray-300 font-mono text-lg overflow-x-auto">${escapeHtml(firstQues?.codeSnippet || "")}</pre>
                </div>
            </div>

            <!-- Options (2 per row for tablet) -->
            <div class="grid grid-cols-2 gap-4" id="loaded-options-container-tablet">
                ${['A', 'B', 'C', 'D'].map((letter, index) => `
                    <div class="flex items-center p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer" data-option="${index}">
                        <div class="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                            <span class="font-bold text-gray-700 dark:text-gray-300">${letter}</span>
                        </div>
                        <div class="flex-1">
                            <div class="text-gray-900 dark:text-white">${escapeHtml(firstQues?.options[index])}</div>
                        </div>
                        <div class="ml-4 h-6 w-6 rounded-full border-2 border-gray-300 dark:border-gray-600" data-selected="option" data-number="${index}"></div>
                    </div>
                `).join('')}
            </div>
        `;

            // Desktop HTML (same as tablet)
            const desktopHTML = `
            <!-- Question Text -->
            <div class="mb-8">
               <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">${escapeHtml(firstQues?.description || "")}</h3>
                <div class="${!firstQues?.codeSnippet?.trim() ? "hidden" : ""} bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <pre class="text-gray-800 dark:text-gray-300 font-mono text-lg overflow-x-auto">${escapeHtml(firstQues?.codeSnippet || "")}</pre>
                </div>
            </div>

            <!-- Options (2 per row for desktop) -->
            <div class="grid grid-cols-2 gap-4" id="loaded-options-container-desktop">
                ${['A', 'B', 'C', 'D'].map((letter, index) => `
                    <div class="flex items-center p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer" data-option="${index}">
                        <div class="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                            <span class="font-bold text-gray-700 dark:text-gray-300">${letter}</span>
                        </div>
                        <div class="flex-1">
                            <div class="text-gray-900 dark:text-white">${escapeHtml(firstQues?.options[index])}</div>
                        </div>
                        <div class="ml-4 h-6 w-6 rounded-full border-2 border-gray-300 dark:border-gray-600" data-selected="option" data-number="${index}"></div>
                    </div>
                `).join('')}
            </div>
        `;

            // Render to all three containers
            const mobileContainer = document.getElementById("render-questions-container-mobile");
            const tabletContainer = document.getElementById("render-questions-container");
            const desktopContainer = document.getElementById("render-questions-container-desktop");

            if (mobileContainer) mobileContainer.innerHTML = mobileHTML;
            if (tabletContainer) tabletContainer.innerHTML = tabletHTML;
            if (desktopContainer) desktopContainer.innerHTML = desktopHTML;

            // Add click listeners to all option containers
            document.getElementById("loaded-options-container-mobile")?.addEventListener("click", showCorrectOption);
            document.getElementById("loaded-options-container-tablet")?.addEventListener("click", showCorrectOption);
            document.getElementById("loaded-options-container-desktop")?.addEventListener("click", showCorrectOption);

        } catch (error) {
            failureToast("Unable to load quiz. Please try again.", "Error Occurred");
        }
    }

    function showCorrectOption(e) {
        const optionElem = e.target.closest('[data-option]');
        if (!optionElem) return;

        const option = optionElem.dataset.option;
        if (!option) return;

        const selectedOption = optionElem.querySelector(`[data-selected]`);
        if (!selectedOption) return;

        currentOption = selectedOption.dataset.number;
        selectedCurrentOption = currentOption;

        // Get the parent container (could be mobile, tablet, or desktop)
        const container = e.currentTarget;
        const loadedOptions = container.querySelectorAll(`[data-selected]`);
        const loadedOptionsDivs = container.querySelectorAll(`[data-option]`);

        // Deselect all other options
        loadedOptions.forEach((opt) => {
            if (currentOption !== opt.dataset.number) {
                opt.classList.remove("bg-blue-300");
            }
        });

        loadedOptionsDivs.forEach((opt) => {
            if (currentOption !== opt.dataset.option) {
                opt.classList.remove("border-blue-500");
                opt.classList.add("border-gray-200", "dark:border-gray-700");
            }
        });

        // Toggle selection
        if (selectedOption.classList.contains("bg-blue-300")) {
            selectedOption.classList.remove("bg-blue-300");
            selectedCurrentOption = null;
            currentOption = null;
        } else {
            selectedOption.classList.add("bg-blue-300");
        }

        // Toggle border
        if (optionElem.classList.contains("border-gray-200") || optionElem.classList.contains("dark:border-gray-700")) {
            optionElem.classList.add("border-blue-500");
            optionElem.classList.remove("border-gray-200", "dark:border-gray-700");
        } else {
            optionElem.classList.remove("border-blue-500");
            optionElem.classList.add("border-gray-200", "dark:border-gray-700");
        }
    }

    updateRemainingTime();
    updateCurrentQuestion();
    loadQuestions();

})