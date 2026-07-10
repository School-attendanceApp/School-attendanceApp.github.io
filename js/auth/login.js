import { supabase } from '../supabase.js';

// دالة مشتركة لتفعيل زر إظهار/إخفاء كلمة المرور
export function setupPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-password');
    toggleBtns.forEach(btn => {
        // نستخدم removeEventListener لضمان عدم تكرار الحدث عند إعادة الاستدعاء
        btn.replaceWith(btn.cloneNode(true));
    });
    
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('.eye-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
                this.style.color = 'var(--primary)';
            } else {
                input.type = 'password';
                icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
                this.style.color = 'var(--text-muted)';
            }
        });
    });
}

export function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    
    // تفعيل العدسة
    setupPasswordToggle();

    // التعامل مع تسجيل الدخول
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('loginEmail').value.trim();
            const passwordInput = document.getElementById('loginPassword').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            if (!emailInput || !passwordInput) return;

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'جاري تسجيل الدخول...';
            submitBtn.disabled = true;

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: emailInput,
                    password: passwordInput,
                });
                if (error) throw error;
                window.location.replace('dashboard.html');
            } catch (error) {
                console.error('Login error:', error.message);
                alert('البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التأكد من البيانات.');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // التعامل مع نسيت كلمة المرور
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('loginEmail').value.trim();
            
            if (!emailInput) {
                alert('يرجى كتابة البريد الإلكتروني في الخانة أولاً، ثم الضغط على نسيت كلمة المرور.');
                return;
            }

            const confirmReset = confirm(`هل تريد إرسال رابط إعادة تعيين كلمة المرور إلى البريد: ${emailInput}؟`);
            if (!confirmReset) return;

            try {
                const { error } = await supabase.auth.resetPasswordForEmail(emailInput);
                if (error) throw error;
                alert('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح. يرجى مراجعة صندوق الوارد.');
            } catch (error) {
                console.error('Reset error:', error.message);
                alert('حدث خطأ أثناء إرسال الرابط. تأكد من صحة البريد الإلكتروني.');
            }
        });
    }
}