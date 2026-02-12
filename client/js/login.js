document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector('form');
    let token = null;

    try {
        token = localStorage.getItem('jwt_token');
    } catch (error) {
        localStorage.removeItem('jwt_token');
        token = null;
    }

    const submitForm = async () => {
        try {
            const formData = new FormData(form);
            let username = formData.get("username");
            let password = formData.get("password");

            const response = await fetch("http://localhost:3000/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            })

            if (response.status === 404) {
                throw new Error("Invalid Credentials");
            }

            if (!response.ok) {
                console.log(response);
                throw new Error("Unable to authenticate user at the moment.")
            }

            const user = await response.json();

            if (!user) {
                throw new Error("Something went wrong, Please try again");
            }

            console.log(user);

            localStorage.setItem("jwt_token", user.token);
            successToast("User Authenticated successfully!", "Success")

            setTimeout(() => {
                window.location.href = "home.html";
            }, 3000);
        } catch (error) {
            if (error.message === "Invalid Credentials") {
                failureToast("Please use valid credentails", "Invalid Credentials");
            }
            else {
                failureToast("Something went wrong, Please try again", "Error Occured");
            }
        }
    }

    form.addEventListener('validated', submitForm);

})