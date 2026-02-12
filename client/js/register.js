import { ApiService } from "./api-service.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector('form');

    const submitForm = async () => {

        const formData = new FormData(form);
        let name = formData.get("name");
        let username= formData.get("username");
        let password = formData.get("password");
        let confirmPassword = formData.get("confirm-pass");

        try {
            const response=await ApiService.post("/auth/register",
                {name, username, password, confirmPassword}
            )

            if(!response.ok){
                throw new Error(response.data.error)
            }

            successToast("User account created successfully", "Registration completed");

            setTimeout(() => {
                window.location.href="login.html";
            }, 3000);
        } catch (error) {
            failureToast(`${error.message}`, "Something went wrong");  
        }
        
    }
    
    form.addEventListener('validated', submitForm);

})