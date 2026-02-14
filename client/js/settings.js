import { ApiService } from "./api-service.js";

document.addEventListener('DOMContentLoaded', () => {

    let difficulty = null;
    let time_limit = null;
    let question_count = null;

    const editUsernameBtn = document.getElementById("edit-username");
    const username = document.getElementById("username");
    const usernameActionContainer = document.getElementById("username-action-container");
    let currentUsername = '';
    const editNameBtn = document.getElementById("edit-name");
    const name = document.getElementById("name");
    const nameActionContainer = document.getElementById("name-action-container");
    let currentName = '';
    const difficultyContainer = document.getElementById("difficulty-container");
    let selectedCheckbox = null;
    const scrollContainer = document.getElementById("scroll-container");
    const selectedQuestionSliderRange = scrollContainer.querySelector(`[data-scroll="question"]`);
    const selectedTimeSliderRange = scrollContainer.querySelector(`[data-scroll="time"]`);
    const quizActionContainer = document.getElementById("quiz-settings-container");
    let localQuestionCount = null;
    let placeholderLocalQuestionCount = null;
    let localTimeLimit = null;
    let placeholderLocalTimeLimit = null;
    let localDifficulty = null;
    let placeholderDifficulty = null;
    const confirmDeleteAccountCheckbox = document.getElementById("confirm-delete-account-checkbox");
    const deleteAccountBtn = document.getElementById("delete-account-btn");
    let user = {};
    const timeLimitDOM = document.getElementById("time-limit");
    const questionCountDOM = document.getElementById("question-count");

    const fillUserSettingsSlider = () => {
        if (selectedQuestionSliderRange) {
            selectedQuestionSliderRange.value = question_count;
            placeholderLocalQuestionCount = question_count;
            localQuestionCount = question_count;
            questionCountDOM.textContent = localQuestionCount;
        }

        if (selectedTimeSliderRange) {
            selectedTimeSliderRange.value = time_limit;
            placeholderLocalTimeLimit = time_limit;
            localTimeLimit = time_limit;
            timeLimitDOM.textContent = localTimeLimit;
        }

        selectedCheckbox = difficultyContainer.querySelector(`[data-level="${difficulty}"]`);
        selectedCheckbox.checked = true;
        localDifficulty = difficulty;
        placeholderDifficulty = difficulty;
    }

    if (selectedCheckbox) {
        selectedCheckbox.checked = true;
    }

    function enableEditUsername() {
        username.readOnly = false;
        usernameActionContainer.classList.remove("hidden");
    }

    const saveUsername = async () => {

        if (username.value.trim() === "") {
            failureToast("Username cannot be empty", "Validation Error");
            return;
        }
        else if (currentUsername === username.value) {
            failureToast("Please use different username to change", "Validation Error");
            return;
        }

        try {
            const response = await ApiService.put("/user/updateMe", { username: username.value });

            if (!response.ok) {
                failureToast("Unable to update user. Please try again later.", "Error Occurred");
                throw new Error("");
            }

            console.log(response);

            successToast("Username updated successfully!", "Operation successful");
            username.readOnly = true;
            usernameActionContainer.classList.add("hidden");
            currentUsername = username.value;
        } catch (error) {
            console.log("Some error occurred");
        }

    }

    const cancelSaveUsername = () => {

        username.value = currentUsername;
        username.readOnly = true;
        usernameActionContainer.classList.add("hidden");

    }

    function enableUsernameActionBtns(e) {

        const button = e.target.closest('[data-action]');

        if (!button) {
            return;
        }

        const action = button.dataset.action;

        if (action !== "save-username" && action !== "cancel-username") {
            return;
        }

        if (action === "save-username") {
            saveUsername();
        }
        else if (action === "cancel-username") {
            cancelSaveUsername();
        }

    }

    const enableEditName = () => {
        name.readOnly = false;
        nameActionContainer.classList.remove("hidden");
    }

    const saveName = async () => {

        if (name.value.trim() === "") {
            failureToast("Name cannot be empty", "Validation Error");
            return;
        }
        else if (currentName === name.value) {
            failureToast("Please use different name to change", "Validation Error");
            return;
        }

        try {
            const response = await ApiService.put("/user/updateMe", { name: name.value });

            if (!response.ok) {
                failureToast("Unable to update user. Please try again later.", "Error Occurred");
                throw new Error("");
            }

            successToast("Name updated successfully!", "Operation successful");
            name.readOnly = true;
            nameActionContainer.classList.add("hidden");
            currentName = name.value;
        } catch (error) {

        }

    }

    const cancelSaveName = () => {

        name.value = currentName;
        name.readOnly = true;
        nameActionContainer.classList.add("hidden");

    }

    const enableNameActionBtns = (e) => {

        const button = e.target.closest('[data-action]');

        if (!button) {
            return;
        }

        const action = button.dataset.action;

        if (action !== "save-name" && action !== "cancel-name") {
            return;
        }

        if (action === "save-name") {
            saveName();
        }
        else if (action === "cancel-name") {
            cancelSaveName();
        }

    }

    function setDifficulty(e) {

        const checkBox = e.target.closest('[data-level]');
        if (!checkBox) {
            return;
        }

        const action = checkBox.dataset.level;
        if (!action) {
            return;
        }

        if (action !== "easy" && action !== "medium" && action !== "hard") {
            return;
        }

        localDifficulty = action;

    }

    const selectScrollOptions = (e) => {

        const rangeSlider = e.target.closest('[data-scroll]');

        if (!rangeSlider) {
            return;
        }

        const scroll_element = rangeSlider.dataset.scroll;

        if (!scroll_element) {
            return;
        }

        if (scroll_element !== "question" && scroll_element !== "time") {
            return;
        }

        if (scroll_element === "question") {
            localQuestionCount = rangeSlider.value;
            questionCountDOM.textContent = localQuestionCount;
        }
        else if (scroll_element === "time") {
            localTimeLimit = rangeSlider.value;
            timeLimitDOM.textContent = localTimeLimit;
        }

    }

    const updateUserSettings = async () => {
        try {
            const response = await ApiService.post("/userSetting/update", { difficulty: localDifficulty, timePerQuestion: Number(localTimeLimit), questionsPerQuiz: Number(localQuestionCount) });

            if (!response) {
                throw new Error();
            }

            const data = response.data;
            if (!data) {
                throw new Error();
            }

            const savedSettings = data.savedSettings;
            return savedSettings;
        } catch (error) {
            return false;
        }
    }

    const enableQuizActionBtns = async (e) => {

        const button = e.target.closest(`[data-action]`);

        if (!button) {
            return;
        }

        const action = button.dataset.action;

        if (!action) {
            return;
        }

        if (action !== "reset" && action !== "cancel" && action !== "save") {
            return;
        }

        if (action === "reset") {
            localQuestionCount = 10;
            localTimeLimit = 30;
            localDifficulty = "easy";
            selectedQuestionSliderRange.value = 10;
            selectedTimeSliderRange.value = 30;
            questionCountDOM.textContent = localQuestionCount;
            timeLimitDOM.textContent = localTimeLimit;

            difficultyContainer.querySelectorAll(`[data-level]`).forEach((cb) => {
                cb.checked = cb.dataset.level === "easy";
            })
        }
        else if (action === "cancel") {
            localQuestionCount = placeholderLocalQuestionCount;
            localTimeLimit = placeholderLocalTimeLimit;
            localDifficulty = selectedCheckbox.dataset.level;
            questionCountDOM.textContent = localQuestionCount;
            timeLimitDOM.textContent = localTimeLimit;

            selectedQuestionSliderRange.value = placeholderLocalQuestionCount;
            selectedTimeSliderRange.value = placeholderLocalTimeLimit;
            difficultyContainer.querySelectorAll(`[data-level]`).forEach((cb) => {
                cb.checked = cb.dataset.level === placeholderDifficulty;
            })
        }
        else if (action === "save") {
            try {
                const response = await updateUserSettings();
                if (!response) {
                    throw new Error();
                }

                console.log(response);

                placeholderLocalTimeLimit = localTimeLimit;
                placeholderDifficulty = localDifficulty;
                placeholderLocalQuestionCount = localQuestionCount;

                successToast("Quiz settings saved successfully!", "Settings Updated");
            } catch (error) {
                failureToast("Unable to set new user settings. Please try again.", "Operation failed");
            }
        }

    }

    const enableDeleteAccountButton = (e) => {

        if (e.target.checked === true) {
            deleteAccountBtn.disabled = false;
        }
        else {
            deleteAccountBtn.disabled = true;
        }

    }

    const deleteAccount = async () => {

        if (deleteAccountBtn.disabled) {
            return;
        }

        try {
            const response = await ApiService.del("/user/deleteMe");
            console.log(response);

            if (!response.ok) {
                throw new Error("Failed to delete account at the moment")
            }

            successToast("User Account has been deleted", "Operation successful");
            localStorage.removeItem("jwt_token");

            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } catch (error) {
            failureToast(`${error.message}`, "Error Occurred");
        }

    }

    const fillInputFields = () => {

        if (!user) {
            return;
        }

        username.value = user.username;
        name.value = user.name;
        currentUsername = user.username;
        currentName = user.name;

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
            if (!user) {
                throw new Error();
            }

            return true;
        } catch (error) {
            // failureToast(`${error.message}`, "Error Occurred");
            return false;
        }

    }

    const fetchUserSettings = async () => {
        try {
            const response = await ApiService.get("/userSetting/fetchUserSettings");
            if (!response) {
                throw new Error();
            }

            const data = response.data;
            if (!data) {
                throw new Error();
            }

            const userSettings = data.userSettings;
            if (!userSettings) {
                throw new Error();
            }

            return userSettings;
        } catch (error) {
            return false;
        }
    }

    const fillUserSettings = (settings) => {

        if (!settings) {
            return;
        }

        console.log(settings)

        difficulty = settings.difficulty;
        time_limit = settings.timePerQuestion;
        question_count = settings.questionsPerQuiz;

        fillUserSettingsSlider();
    }

    const getUserInfo = async () => {
        try {
            const userInfoResponse = await fetchUser();
            if (!userInfoResponse) {
                throw new Error();
            }

            const userSettingsResponse = await fetchUserSettings();
            if (!userSettingsResponse) {
                throw new Error();
            }

            fillUserSettings(userSettingsResponse);
            fillInputFields();
        } catch (error) {

        }
    }

    editUsernameBtn.addEventListener("click", enableEditUsername);
    usernameActionContainer.addEventListener("click", enableUsernameActionBtns);
    editNameBtn.addEventListener("click", enableEditName);
    nameActionContainer.addEventListener("click", enableNameActionBtns);
    difficultyContainer.addEventListener("click", setDifficulty);
    scrollContainer.addEventListener("click", selectScrollOptions);
    quizActionContainer.addEventListener("click", enableQuizActionBtns);
    confirmDeleteAccountCheckbox.addEventListener("change", enableDeleteAccountButton);
    deleteAccountBtn.addEventListener("click", deleteAccount);
    getUserInfo();

})