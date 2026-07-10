import { supabase } from '../supabase.js';

export async function initAuthState() {
    // تحديد الصفحة الحالية
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath.includes('login.html') || currentPath.endsWith('/');

    try {
        // جلب الجلسة الحالية من Supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
            // المستخدم مسجل الدخول
            if (isAuthPage) {
                // منع التواجد في صفحة تسجيل الدخول وتوجيهه للوحة القيادة
                window.location.replace('dashboard.html');
            } else {
                // تحديث اسم المستخدم في الشريط العلوي (إن وجد)
                const userNameEl = document.querySelector('.user-name');
                const avatarEl = document.querySelector('.avatar');
                if (userNameEl && session.user.user_metadata.full_name) {
                    const fullName = session.user.user_metadata.full_name;
                    userNameEl.textContent = fullName;
                    if(avatarEl) avatarEl.textContent = fullName.charAt(0);
                }
            }
        } else {
            // المستخدم غير مسجل الدخول
            if (!isAuthPage) {
                // منعه من تصفح الصفحات الداخلية وتوجيهه لتسجيل الدخول
                window.location.replace('login.html');
            }
        }

        // الاستماع لتغيرات الجلسة (تسجيل خروج في تبويب آخر مثلاً)
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                window.location.replace('login.html');
            }
        });

    } catch (error) {
        console.error('Auth state error:', error.message);
    }
}