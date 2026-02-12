document.addEventListener('DOMContentLoaded', () => {

    const textFields = document.querySelectorAll('[type="text"]');
    const emailFields = document.querySelectorAll('[type="email"]');
    const passwordFields = document.querySelectorAll('[type="password"]');
    const dropdownFields = document.querySelectorAll('select');
    const textAreaFields = document.querySelectorAll('textarea');
    // const submitBtn = document.querySelector('[type="submit"]');
    const form = document.querySelector('form');

    const invalidate = (field, errorField, errorMessage) => {
        field.focus();
        errorField.textContent = errorMessage;
        return false;
    }

    const validateTextField = (errorField, field) => {
        if (field.value.trim() === "") {
            return invalidate(field, errorField, "Please fill this field");
        }
        if (field.value.length < 2) {
            return invalidate(field, errorField, "Please input atleast 2 letters");
        }
        if (field.value.length > 50) {
            return invalidate(field, errorField, "Max 50 letters are allowed");
        }

        errorField.textContent = "";
        return true;
    }

    const validateEmailField = (errorField, field) => {
        if (field.value.trim() === "") {
            return invalidate(field, errorField, "Email is mandatory!");
        }
        if (!/^\S+@\S+\.\S+$/.test(field.value)) {
            return invalidate(field, errorField, "Please use a valid format");
        }

        errorField.textContent = "";
        return true;
    }

    const validateDropdownField = (errorField, field) => {
        if (field.value === "") {
            return invalidate(field, errorField, "Please select any dropdown option");
        }

        errorField.textContent = "";
        return true;
    }

    const validateTextAreaField = (errorField, field) => {
        if (field.value.trim() === "") {
            return invalidate(field, errorField, "Please fill this textarea")
        }
        if (field.value.length < 10) {
            return invalidate(field, errorField, "Please provide at least 10 letters")
        }

        errorField.textContent = "";
        return true;
    }

    const validatePasswordField = (errorField, field) => {
        if (field.value.trim() === "") {
            return invalidate(field, errorField, "Password is required!");
        }

        errorField.textContent = "";
        return true;
    }

    const validateConfirmPasswordField = (errorField, field, password) => {

        if (field.value.trim() === "") {
            return invalidate(field, errorField, "Confirm Password is required");
        }
        if (field.value !== password) {
            return invalidate(field, errorField, "Passwords don't match");
        }

        errorField.textContent = "";
        return true;

    }

    const validateRegisteredPasswordField = (errorField, field) => {

        if (field.value === "") {
            return invalidate(field, errorField, "Password is required!");
        }
        if (field.value.length < 8) {
            return invalidate(field, errorField, "Password should be atleast 8 characters!");
        }
        if (field.value.length > 15) {
            return invalidate(field, errorField, "Password cannot exceed over 15 characters");
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/;
        if (!passwordRegex.test(field.value)) {
            return invalidate(field, errorField, "Password should contain atleast 1 uppercase, 1 lowercase, 1 digit and 1 special character");
        }

        errorField.textContent = "";
        return true;

    }

    const submitForm = (e) => {

        e.preventDefault();
        let pass = "";

        for (const field of textFields) {
            const errorField = field.parentElement.querySelector('.field-error');
            if (field.required) {
                const validationResponse = validateTextField(errorField, field);
                if (!validationResponse) {
                    return;
                }
            }
        }

        for (const field of emailFields) {
            const errorField = field.parentElement.querySelector('.field-error');

            if (field.required) {
                const validationResponse = validateEmailField(errorField, field);
                if (!validationResponse) {
                    return;
                }
            }
        }

        for (const field of dropdownFields) {
            const errorField = field.parentElement.querySelector('.field-error');

            if (field.required) {
                const validationResponse = validateDropdownField(errorField, field);
                if (!validationResponse) {
                    return;
                }
            }
        }

        for (const field of textAreaFields) {
            const errorField = field.parentElement.querySelector('.field-error');

            if (field.required) {
                const validationResponse = validateTextAreaField(errorField, field);
                if (!validationResponse) {
                    return;
                }
            }
        }

        for (const field of passwordFields) {
            const errorField = field.parentElement.querySelector('.field-error');
            const confirmPassField = field.parentElement.querySelector('.confirm-pass');
            const registerPassword = field.parentElement.querySelector('.registered-pass');

            if (field.required) {
                if (confirmPassField) {
                    const validationResponse = validateConfirmPasswordField(errorField, field, pass);
                    if (!validationResponse) {
                        return;
                    }
                }
                else {
                    if (registerPassword) {
                        const validationResponse = validateRegisteredPasswordField(errorField, field);
                        if (!validationResponse) {
                            return;
                        }
                        if (pass.trim() === "") {
                            pass = field.value;
                        }
                    }
                    else {
                        const validationResponse = validatePasswordField(errorField, field);
                        if (!validationResponse) {
                            return;
                        }
                        if (pass.trim() === "") {
                            pass = field.value;
                        }
                    }
                }
            }
        }

        form.dispatchEvent(new CustomEvent('validated', { bubbles: true }));
    }

    form.addEventListener('submit', submitForm);

})