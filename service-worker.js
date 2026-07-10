// تغيير هذا الرقم مع كل تحديث جديد ترفعه للمشروع (v2, v3, v4...)
const APP_VERSION = 'v2';
const CACHE_NAME = `attendance-app-${APP_VERSION}`;

// الاستراتيجية: Network First, falling back to cache
self.addEventListener('install', (event) => {
    console.log(`[Service Worker] Installed Version: ${APP_VERSION}`);
    self.skipWaiting(); // فرض تنشيط النسخة الجديدة فوراً
});

self.addEventListener('activate', (event) => {
    console.log(`[Service Worker] Activated Version: ${APP_VERSION}`);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    // مسح أي كاش لا يتطابق مع الإصدار الحالي
                    if (cache !== CACHE_NAME) {
                        console.log(`[Service Worker] Deleting old cache: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim(); // تولي السيطرة على كل الصفحات المفتوحة فوراً
});

self.addEventListener('fetch', (event) => {
    // تجاهل طلبات قاعدة البيانات (Supabase API) من الكاش لضمان جلب بيانات حقيقية
    if (event.request.url.includes('supabase.co')) return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});