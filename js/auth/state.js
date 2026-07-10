import { supabase } from '../supabase.js';

export async function initAuthState() {
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath.includes('login.html') || currentPath.endsWith('/');

    // [الإضافة الجديدة]: منع التوجيه التلقائي إذا كان المستخدم قادماً من رابط استعادة كلمة المرور
    if (window.location.hash.includes('type=recovery')) {
        console.log('Recovery session detected. Pausing auto-redirect.');
        return; 
    }

    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
            if (isAuthPage) {
                window.location.replace('dashboard.html');
            } else {
                const userNameEl = document.querySelector('.user-name');
                const avatarEl = document.querySelector('.avatar');
                if (userNameEl && session.user.user_metadata.full_name) {
                    const fullName = session.user.user_metadata.full_name;
                    userNameEl.textContent = fullName;
                    if(avatarEl) avatarEl.textContent = fullName.charAt(0);
                }
            }
        } else {
            if (!isAuthPage) {
                window.location.replace('login.html');
            }
        }

        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                window.location.replace('login.html');
            }
        });

    } catch (error) {
        console.error('Auth state error:', error.message);
    }
}