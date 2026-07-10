export function initPWA() {
    let deferredPrompt;
    const installBtn = document.getElementById('installAppBtn');

    // اكتشاف إذا كان الجهاز آيفون/آيباد (iOS)
    const isIOS = () => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    };

    // اكتشاف إذا كان التطبيق مثبتاً بالفعل (Standalone)
    const isStandalone = () => {
        return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    };

    // 1. التعامل مع الأندرويد والويندوز والماك (Chrome/Edge)
    window.addEventListener('beforeinstallprompt', (e) => {
        // منع ظهور النافذة الافتراضية
        e.preventDefault();
        deferredPrompt = e;
        
        // إظهار زر التثبيت الخاص بنا إذا لم يكن التطبيق مثبتاً
        if (installBtn && !isStandalone()) {
            installBtn.style.display = 'inline-flex';
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt(); // إظهار نافذة التثبيت
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    installBtn.style.display = 'none';
                }
                deferredPrompt = null;
            }
        });
    }

    // 2. التعامل مع هواتف الآيفون (Apple Safari)
    // سفاري لا يدعم beforeinstallprompt، لذلك يجب توجيه المستخدم يدوياً
    if (isIOS() && !isStandalone()) {
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
            installBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                تثبيت للآيفون
            `;
            installBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('لتثبيت التطبيق على آيفون:\n1. اضغط على زر "المشاركة" (Share) في أسفل المتصفح.\n2. اختر "إضافة إلى الصفحة الرئيسية" (Add to Home Screen).');
            });
        }
    }
}