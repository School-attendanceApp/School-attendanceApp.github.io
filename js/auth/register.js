import { supabase } from '../supabase.js';

export function initRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');

    // Toggle Forms
    if (showRegisterBtn && showLoginBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            authTitle.textContent = 'حساب جديد';
            authSubtitle.textContent = 'أدخل بياناتك لإنشاء حسابك';
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            authTitle.textContent = 'مرحباً بك';
            authSubtitle.textContent = 'قم بتسجيل الدخول للمتابعة';
        });
    }

    // Handle Registration
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('registerName').value.trim();
            const emailInput = document.getElementById('registerEmail').value.trim();
            const passwordInput = document.getElementById('registerPassword').value;
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'جاري إنشاء الحساب...';
            submitBtn.disabled = true;

            try {
                const { data, error } = await supabase.auth.signUp({
                    email: emailInput,
                    password: passwordInput,
                    options: {
                        data: {
                            full_name: nameInput
                        }
                    }
                });

                if (error) throw error;

                alert('تم إنشاء الحساب بنجاح! جاري توجيهك...');
                window.location.replace('dashboard.html');

            } catch (error) {
                console.error('Registration error:', error.message);
                alert('فشل إنشاء الحساب: ' + error.message);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
}