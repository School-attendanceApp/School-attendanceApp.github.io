import { initUI } from './ui.js';
import { setupRouter } from './router.js';
import { initLogin } from './auth/login.js';
import { initRegister } from './auth/register.js'; // تم الإضافة
import { initLogout } from './auth/logout.js';
import { initAuthState } from './auth/state.js'; // تم الإضافة

document.addEventListener('DOMContentLoaded', async () => {
    console.log('App initialized');
    
    // التحقق من حالة الدخول قبل أي شيء لحماية المسارات
    await initAuthState();
    
    initUI();
    setupRouter();
    
    initLogin();
    initRegister(); // تم الإضافة
    initLogout();
});