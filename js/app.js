// صائد الأخطاء العام (للإنتاج)
window.addEventListener('error', (event) => {
    alert("تنبيه برمجي: يوجد خطأ يمنع التطبيق من العمل. " + event.message);
});

import { initUI } from './ui.js';
import { setupRouter } from './router.js';
import { initLogin } from './auth/login.js';
import { initRegister } from './auth/register.js';
import { initLogout } from './auth/logout.js';
import { initAuthState } from './auth/state.js';
import { initPWA } from './pwa.js';
import { initClasses } from './classes.js'; // [جديد] استدعاء الفصول

document.addEventListener('DOMContentLoaded', async () => {
    console.log('App initialized');
    
    // التحقق من حالة الدخول قبل أي شيء لحماية المسارات
    await initAuthState();
    
    initUI();
    setupRouter();
    
    initLogin();
    initRegister();
    initLogout();
    
    // تشغيل منطق التثبيت
    initPWA();
    
    // [جديد] تشغيل وحدة الفصول
    initClasses();
});

// تسجيل Service Worker لتفعيل الكاش والـ PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker Registered!', reg.scope))
            .catch(err => console.error('Service Worker Registration Failed!', err));
    });
}