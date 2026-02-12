document.addEventListener("DOMContentLoaded", () => {

    const fetchCategories = async () => {
        const loadingCategoriesContainer = document.getElementById("loading-categories");
        const RetryCategoriesContainer = document.getElementById("retry-categories");
        const loadedCategoriesContainer = document.getElementById("loaded-categories");
        let html1 = '';

        ['1', '2', '3', '4'].forEach((topic) => {
            html1 += `
                <div class="dark:bg-gray-800 text-white rounded-xl p-6 shadow-lg">
            <div class="text-3xl mb-4">
                <div class="h-8 w-32 bg-white/30 rounded animate-pulse"></div>
            </div>
            <div class="text-blue-100 h-8">
                <div class="h-4 w-full bg-blue-200/30 rounded mb-2 animate-pulse"></div>
                <div class="h-4 w-3/4 bg-blue-200/30 rounded animate-pulse"></div>
            </div>
            <div class="mt-4 text-sm"></div>
        </div>
            `
        })
 
        loadingCategoriesContainer.innerHTML = html1;

        try {
            const response = await fetch('https://code-check-backend-dynw.onrender.com/api/v1/topic/topics');

            if (!response.ok) {
                throw new Error(`HTTP: ${response.status}`)
            }

            const categoriesJSON = await response.json();
            const categories = categoriesJSON?.topics;

            if (Array.isArray(categories) && categories.length > 0) {
                let html2 = '';

                categories.forEach((category) => {
                    html2 += `
                    <div class="min-w-[275px] dark:bg-gray-800 text-white rounded-xl p-6 shadow-lg">
                        <div class="text-3xl mb-4">
                            <div class="h-8 w-full rounded text-[21px] mb-2">${category.topicName}</div>
                            <div class="text-blue-100 h-24 mb-8 text-sm">
                                <div class="h-4 w-full rounded">${category.description || ""}</div>
                            </div> 
                        </div>
                    </div>
        `
                })

                loadingCategoriesContainer.classList.add('hidden');
                loadedCategoriesContainer.classList.remove('hidden');
                loadedCategoriesContainer.innerHTML=html2;
            }

        } catch (error) {
            console.error("Failed to load categories, Retrying...");
        }
    }

    fetchCategories();

})