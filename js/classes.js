import { supabase } from './supabase.js';

export async function initClasses() {
    // التحقق من أننا في صفحة الفصول
    if (!window.location.pathname.includes('class.html')) return;

    const showFormBtn = document.getElementById('showAddClassFormBtn');
    const cancelFormBtn = document.getElementById('cancelAddClassBtn');
    const formContainer = document.getElementById('addClassFormContainer');
    const addClassForm = document.getElementById('addClassForm');
    const classesGrid = document.getElementById('classesGrid');
    const noClassesMsg = document.getElementById('noClassesMsg');
    
    // مؤشرات الحفظ في الشريط العلوي
    const syncText = document.getElementById('syncText');
    const syncIcon = document.getElementById('syncIcon');

    // إظهار وإخفاء النموذج
    if (showFormBtn && formContainer) {
        showFormBtn.addEventListener('click', () => formContainer.style.display = 'block');
    }
    if (cancelFormBtn && formContainer) {
        cancelFormBtn.addEventListener('click', () => {
            formContainer.style.display = 'none';
            addClassForm.reset();
        });
    }

    // جلب هوية المعلم الحالي
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const userId = session.user.id;

    // دالة جلب الفصول وعرضها
    async function loadClasses() {
        try {
            const { data: classes, error } = await supabase
                .from('classes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            classesGrid.innerHTML = ''; // تفريغ الشبكة

            if (classes.length === 0) {
                noClassesMsg.style.display = 'block';
            } else {
                noClassesMsg.style.display = 'none';
                classes.forEach(cls => {
                    const classCard = document.createElement('div');
                    classCard.className = 'card';
                    classCard.style.borderTop = `4px solid ${cls.border_color}`;
                    classCard.innerHTML = `
                        <h3 style="margin-top: 0;">${cls.class_name} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">(${cls.subject})</span></h3>
                        <p style="margin: 5px 0; font-size: 0.9rem;"><strong>المدرسة:</strong> ${cls.school_name}</p>
                        <p style="margin: 5px 0; font-size: 0.9rem;"><strong>العام:</strong> ${cls.academic_year} - ${cls.semester}</p>
                        <p style="margin: 5px 0; font-size: 0.8rem; color: var(--text-muted);">${cls.governorate} - ${cls.administration}</p>
                    `;
                    classesGrid.appendChild(classCard);
                });
            }
        } catch (error) {
            console.error('Error loading classes:', error.message);
        }
    }

    // دالة حفظ فصل جديد
    if (addClassForm) {
        addClassForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const saveBtn = document.getElementById('saveClassBtn');
            saveBtn.disabled = true;
            syncText.textContent = 'جاري الحفظ...';
            syncIcon.textContent = '↻';

            const classData = {
                teacher_id: userId,
                governorate: document.getElementById('classGov').value.trim(),
                administration: document.getElementById('classAdmin').value.trim(),
                school_name: document.getElementById('classSchool').value.trim(),
                academic_year: document.getElementById('classYear').value.trim(),
                semester: document.getElementById('classSemester').value.trim(),
                class_name: document.getElementById('className').value.trim(),
                subject: document.getElementById('classSubject').value.trim(),
                border_color: document.getElementById('classColor').value
            };

            try {
                const { error } = await supabase.from('classes').insert([classData]);
                
                if (error) throw error;

                // تحديث الواجهة
                formContainer.style.display = 'none';
                addClassForm.reset();
                syncText.textContent = 'تم الحفظ';
                syncIcon.textContent = '✓';
                
                // إعادة تحميل الفصول لظهور الفصل الجديد
                await loadClasses();

            } catch (error) {
                console.error('Error saving class:', error.message);
                alert('حدث خطأ أثناء حفظ الفصل: ' + error.message);
                syncText.textContent = 'خطأ في الحفظ';
                syncIcon.textContent = '✖';
            } finally {
                saveBtn.disabled = false;
            }
        });
    }

    // التحميل الأولي للفصول عند فتح الصفحة
    loadClasses();
}