document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector('form');

    const submitForm = () => {
        
        successToast("Your query has been submitted", "Form Submitted")

        setTimeout(()=>{
            form.submit();
        }, 3000)
    }

    form.addEventListener('validated', submitForm);

})