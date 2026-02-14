import { ApiService } from "./api-service.js";

document.addEventListener('DOMContentLoaded', () => {

    const topicContainer = document.getElementById('topics-container');
    const selectedTopic = document.getElementById('selected-topic');
    const startBtn = document.getElementById('startBtn');
    const selectedTopicIcon = document.getElementById('selected-topic-icon');
    let isTopicSelected = false;
    let selectedTopicName = "";
    let selectedTopicId = "";
    let topics = [];
    let user = {};
    let userHydrated = false;
    let topicId = '';

    const renderTopics = () => {

        let html = "";

        if (topics.length === 0) {
            ['1', '2', '3', '4', '5'].forEach(() => {
                html = html + `
                <div class="dark:bg-gray-800 text-white rounded-xl p-6 shadow-lg">
                    <div class="text-3xl mb-4">
                        <div class="h-8 w-[170px] bg-white/30 rounded animate-pulse"></div>
                    </div>
                    <div class="text-blue-100 h-8">
                        <div class="h-4 w-full bg-blue-200/30 rounded mb-2 animate-pulse"></div>
                        <div class="h-4 w-3/4 bg-blue-200/30 rounded animate-pulse"></div>
                    </div>
                    <div class="mt-4 text-sm"></div>
                </div>
            `
            })
        }
        else {
            topics.forEach((topic) => {
                return html = html + `
                <div class="flex-shrink-0 w-60">
                    <div
                        class="bg-gradient-to-br dark:bg-gray-800 rounded-2xl p-5 shadow-xl text-white h-full flex flex-col">
                        <div class="text-xl mb-3">${topic.topicName}</div>
                        <p class="text-indigo-100 mb-4 text-sm">${topic.description}</p>
                        <button
                            class="mt-auto w-full bg-white text-black font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors text-sm" data-action="selectTopic" data-name="${topic.topicName}" data-abbreviation=${topic.topicCode} data-id=${topic._id}>
                            Select ${topic.topicName}
                        </button>
                    </div>
                </div>
            `
            })
        }

        topicContainer.innerHTML = html;

    }

    const fetchTopics = async () => {
        try {
            const response = await fetch("https://code-check-backend-dynw.onrender.com/api/v1/topic/topics");
            if (!response.ok) {
                throw new Error(`HTTP: ${response.status}`)
            }

            const localTopicsJSON = await response.json();
            topics = localTopicsJSON?.topics;

            if (!Array.isArray(topics) || topics.length === 0) {
                console.log("Unable to fetch topics at the moment");
                return;
            }

            renderTopics();
        } catch (error) {
            console.error("Unable to fetch topics at the moment");
        }
    }

    const generateQuiz = async () => {
        try {
            const response = await ApiService.post("/quiz/generate", { topicId });

            if (!response.ok) {
                throw new Error();
            }

            const data = response.data;
            if (!data) {
                throw new Error();
            }

            return data;
        } catch (error) {
            console.error("Something went wrong");
        }
    }

    const launchQuiz = async () => {

        if (userHydrated === false) {
            failureToast("Please login to attempt quiz", "Authentication needed");
            return;
        }

        if (isTopicSelected && selectedTopicName != "") {
            const quiz = await generateQuiz();
            if (!quiz) {
                failureToast("Unable to generate quiz. Please try again.", "Operation failed");
                return;
            }

            localStorage.setItem("quiz", JSON.stringify(quiz));
            localStorage.setItem("current-question", "1");
            successToast(`Redirecting to "${selectedTopicName}" quiz`, "Operation success");
            console.log(quiz);

            setTimeout(() => {
                window.location.href = `/quiz?quizId=${quiz?.quizId}`;
            }, 3000);
        }

    }

    const launchQuizDetails = (topic, abbreviation, topicId) => {

        selectedTopic.textContent = topic;
        selectedTopicIcon.textContent = abbreviation;
        startBtn.disabled = false;
        isTopicSelected = true;
        selectedTopicName = topic;
        selectedTopicId = topicId;

    }

    const selectTopic = (e) => {
        const action = e.target.dataset.action;
        const name = e.target.dataset.name;
        const abbreviation = e.target.dataset.abbreviation;
        topicId = e.target.dataset.id;

        if (!action) {
            console.log('Does not exist')
            return;
        }

        launchQuizDetails(name, abbreviation, topicId);
    }

    const fetchUser = async () => {

        try {
            const response = await ApiService.get("/user/me");

            if (!response.ok) {
                throw new Error("");
            }

            const userObj = response.data;
            if (!userObj) {
                throw new Error("");
            }

            user = userObj.user;
            userHydrated = true;
        } catch (error) {
            // failureToast(`${error.message}`, "Error Occurred")
        }

    }

    topicContainer.addEventListener('click', selectTopic);
    startBtn.addEventListener('click', launchQuiz);

    if (topics.length > 0) {
        renderTopics();
    }

    renderTopics();
    fetchTopics();
    fetchUser();

})