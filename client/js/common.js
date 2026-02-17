function successToast(message, title = 'Success') {
    let container = document.querySelector('#toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const toastHTML = `
        <div class="toast" style="
            background: #1e1e1e;
            color: #e4e4e7;
            padding: 14px 16px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), 0 0 0 1px #2a2a2a;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            display: flex;
            gap: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            min-width: 300px;
            max-width: 400px;
            border-left: 3px solid #22c55e;
        ">
            <div style="
                width: 32px;
                height: 32px;
                border-radius: 8px;
                background: rgba(34, 197, 94, 0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            ">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 4.5" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 4px;
                    color: #f4f4f5;
                ">${title}</div>
                <div style="
                    font-size: 13px;
                    color: #a1a1aa;
                    line-height: 1.4;
                ">${message}</div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHTML);

    const toast = container.lastElementChild;
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function failureToast(message, title = 'Error') {
    let container = document.querySelector('#toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const toastHTML = `
        <div class="toast" style="
            background: #1e1e1e;
            color: #e4e4e7;
            padding: 14px 16px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), 0 0 0 1px #2a2a2a;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            display: flex;
            gap: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            min-width: 300px;
            max-width: 400px;
            border-left: 3px solid #ef4444;
        ">
            <div style="
                width: 32px;
                height: 32px;
                border-radius: 8px;
                background: rgba(239, 68, 68, 0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            ">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 4px;
                    color: #f4f4f5;
                ">${title}</div>
                <div style="
                    font-size: 13px;
                    color: #a1a1aa;
                    line-height: 1.4;
                ">${message}</div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHTML);

    const toast = container.lastElementChild;
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Inject loader styles once
(function injectLoaderStyles() {
    if (document.getElementById('global-loader-styles')) return;

    const style = document.createElement('style');
    style.id = 'global-loader-styles';
    style.innerHTML = `
        @keyframes globalSpin {
            to { transform: rotate(360deg); }
        }

        #global-loader {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        #global-loader.show {
            opacity: 1;
        }

        #global-loader .spinner {
            width: 60px;
            height: 60px;
            border: 6px solid rgba(59, 130, 246, 0.2);
            border-top: 6px solid #3b82f6;
            border-radius: 50%;
            animation: globalSpin 0.8s linear infinite;
        }
    `;

    document.head.appendChild(style);
})();


function showLoader() {
    if (document.getElementById('global-loader')) return;

    const loader = document.createElement('div');
    loader.id = 'global-loader';

    loader.innerHTML = `<div class="spinner"></div>`;

    document.body.appendChild(loader);

    // Trigger fade in
    requestAnimationFrame(() => {
        loader.classList.add('show');
    });
}


function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (!loader) return;

    loader.classList.remove('show');

    setTimeout(() => {
        loader.remove();
    }, 200);
}