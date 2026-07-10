import { supabase } from '../supabase.js';

export function initLogin() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // منع إعادة تحميل الصفحة
            
            // جلب البيانات بدقة باستخدام الـ IDs الجديدة
            const emailInput = document.getElementById('loginEmail').value.trim();
            const passwordInput = document.getElementById('loginPassword').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            if (!emailInput || !passwordInput) {
                alert('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
                return;
            }

            // تغيير حالة الزر لمنع الضغط المزدوج
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'جاري تسجيل الدخول...';
            submitBtn.disabled = true;

            try {
                // الاتصال بقاعدة البيانات للتحقق
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: emailInput,
                    password: passwordInput,
                });

                if (error) throw error;

                // توجيه المستخدم للوحة القيادة عند النجاح
                window.location.replace('dashboard.html');

            } catch (error) {
                console.error('Login error:', error.message);
                alert('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
            } finally {
                // إعادة الزر لحالته الطبيعية
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
}