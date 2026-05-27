async function initI18n() {
    const supportedLangs = ['ko', 'ja', 'en'];
    const defaultLang = 'ko';
    
    let lang = localStorage.getItem('lang');
    
    if (!lang) {
        const browserLang = navigator.language.split('-')[0];
        lang = supportedLangs.includes(browserLang) ? browserLang : defaultLang;
        localStorage.setItem('lang', lang);
    }
    
    const langSelector = document.getElementById('lang-selector');
    
    if (langSelector) {
        langSelector.value = lang;
        langSelector.addEventListener('change', (e) => {
            localStorage.setItem('lang', e.target.value);
            location.reload();
        });
    }

    try {
        const response = await fetch(`/static/lang/${lang}.json`);
        const translations = await response.json();
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                if (el.tagName === 'INPUT' && el.type === 'placeholder') {
                    el.placeholder = translations[key];
                } else {
                    el.innerText = translations[key];
                }
            }
        });
        
        // Handle elements that need dynamic text + static data
        document.querySelectorAll('[data-i18n-fmt]').forEach(el => {
            const key = el.getAttribute('data-i18n-fmt');
            const fmt = translations[key];
            if (fmt) {
                // Simple placeholder replacement if needed, 
                // but for now we just use the keys as they are or with textContent
            }
        });

    } catch (error) {
        console.error('Failed to load translations:', error);
    }
}

document.addEventListener('DOMContentLoaded', initI18n);
