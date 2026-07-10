import { supabase } from '../supabase.js';

export function initLogin() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // منع إعادة تحميل الصفحة
            
            // جلب البيانات من الحقول
            const emailInput = loginForm.querySelector('input[type="email"]').value;
            const passwordInput = loginForm.querySelector('input[type="password"]').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            if (!emailInput || !passwordInput) {
                alert('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
                return;
            }

            // تغيير حالة الزر
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'جاري تسجيل الدخول...';
            submitBtn.disabled = true;

            try {
                // محاولة تسجيل الدخول عبر Supabase
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: emailInput,
                    password: passwordInput,
                });

                if (error) throw error;

                // إذا نجح تسجيل الدخول، يتم توجيه المعلم للوحة القيادة
                window.location.replace('dashboard.html');

            } catch (error) {
                console.error('Login error:', error.message);
                alert('فشل تسجيل الدخول: ' + error.message);
            } finally {
                // إعادة الزر لحالته الطبيعية
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
}