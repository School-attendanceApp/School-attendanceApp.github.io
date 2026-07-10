import { supabase } from '../supabase.js';

export function initLogout() {
    // البحث عن زر تسجيل الخروج في القائمة الجانبية بناءً على النص
    const navItems = document.querySelectorAll('.nav-item');
    const logoutBtn = Array.from(navItems).find(item => item.textContent.trim() === 'تسجيل الخروج');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // منع الرابط من تحديث الصفحة فوراً
            
            // رسالة تأكيد للمستخدم
            const confirmLogout = confirm('هل أنت متأكد أنك تريد تسجيل الخروج من النظام؟');
            if (!confirmLogout) return;

            try {
                // أمر تسجيل الخروج من قاعدة بيانات Supabase
                const { error } = await supabase.auth.signOut();
                
                if (error) throw error;
                
                // تنظيف أي بيانات محلية (سيتم استخدامها لاحقاً في التخزين المحلي)
                localStorage.clear();
                sessionStorage.clear();
                
                // توجيه المستخدم لصفحة تسجيل الدخول
                window.location.replace('login.html');
                
            } catch (error) {
                console.error('Logout error:', error.message);
                alert('حدث خطأ أثناء محاولة تسجيل الخروج. يرجى المحاولة مرة أخرى.');
            }
        });
    }
}