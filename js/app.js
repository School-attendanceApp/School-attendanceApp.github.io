import { initUI } from './ui.js';
import { setupRouter } from './router.js';
// الأسطر الجديدة: استدعاء دوال المصادقة
import { initLogin } from './auth/login.js';
import { initLogout } from './auth/logout.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    
    // تشغيل واجهة المستخدم والتوجيه
    initUI();
    setupRouter();
    
    // الأسطر الجديدة: تشغيل نظام تسجيل الدخول والخروج
    initLogin();
    initLogout();
});