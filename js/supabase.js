import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// الرابط الخاص بك (بعد إزالة الجزء الأخير)
const supabaseUrl = 'https://xitohehgvwjjyfvzqpgl.supabase.co';

// المفتاح الخاص بك (الذي قمت بنسخه من صورة anon public)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdG9oZWhndndqanlmdnpxcGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MzU2OTAsImV4cCI6MjA5OTIxMTY5MH0.WfiFewkqbmZFpQB3I-11L9mEDYVqoIJbiWjhuIbjqt4';

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("تم التهيئة والاتصال بـ Supabase بنجاح!");