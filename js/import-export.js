// ملء قائمة الأسابيع
function fillWeeksList() {
    const weekSelect = document.getElementById('weekSelect');
    const importWeek = document.getElementById('importWeek');
    const weeks = Array.from({length: 32}, (_, i) => i + 1);
    
    weeks.forEach(week => {
        const option = `<option value="${week}">الأسبوع ${week}</option>`;
        weekSelect.innerHTML += option;
        if(importWeek) importWeek.innerHTML += option;
    });
}

// تحميل نموذج Excel
function downloadTemplate() {
    const headers = ['رقم_الجلوس', 'الدرجة', 'ملاحظات'];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "درجات الطلاب");
    XLSX.writeFile(wb, `نموذج_درجات_الطلاب.xlsx`);
}

// استيراد الدرجات
async function importGrades() {
    const fileInput = document.getElementById('gradesFile');
    const weekSelect = document.getElementById('importWeek');
    const progressBar = document.querySelector('.progress');
    const preview = document.getElementById('importPreview');
    
    if (!fileInput.files.length || !weekSelect.value) {
        alert('يرجى اختيار ملف وتحديد الأسبوع');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // عرض البيانات في جدول المعاينة
        const previewTable = preview.querySelector('tbody');
        previewTable.innerHTML = '';

        for(let row of jsonData) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.رقم_الجلوس}</td>
                <td id="name_${row.رقم_الجلوس}">جاري التحقق...</td>
                <td id="group_${row.رقم_الجلوس}">-</td>
                <td>${row.الدرجة}</td>
                <td id="status_${row.رقم_الجلوس}">
                    <div class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">جاري التحقق...</span>
                    </div>
                </td>
            `;
            previewTable.appendChild(tr);
        }

        preview.style.display = 'block';
        progressBar.style.display = 'block';

        // التحقق من البيانات وحفظها
        for(let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            const progress = ((i + 1) / jsonData.length) * 100;
            progressBar.querySelector('.progress-bar').style.width = `${progress}%`;

            // هنا يمكن إضافة التحقق من البيانات وحفظها في Firebase
            // مثال:
            /*
            try {
                const studentRef = db.collection('students').doc(row.رقم_الجلوس);
                const studentDoc = await studentRef.get();
                
                if(studentDoc.exists) {
                    const studentData = studentDoc.data();
                    document.getElementById(`name_${row.رقم_الجلوس}`).textContent = studentData.name;
                    document.getElementById(`group_${row.رقم_الجلوس}`).textContent = studentData.group;
                    
                    await db.collection('grades').add({
                        studentId: row.رقم_الجلوس,
                        week: parseInt(weekSelect.value),
                        score: parseFloat(row.الدرجة),
                        notes: row.ملاحظات || '',
                        timestamp: new Date()
                    });
                    
                    document.getElementById(`status_${row.رقم_الجلوس}`).innerHTML = 
                        '<span class="text-success">تم الحفظ</span>';
                } else {
                    document.getElementById(`status_${row.رقم_الجلوس}`).innerHTML = 
                        '<span class="text-danger">الطالب غير موجود</span>';
                }
            } catch(error) {
                document.getElementById(`status_${row.رقم_الجلوس}`).innerHTML = 
                    '<span class="text-danger">خطأ في الحفظ</span>';
            }
            */
        }
    };

    reader.readAsArrayBuffer(file);
}

// تصدير الدرجات
function exportGrades() {
    const group = document.getElementById('groupSelect').value;
    const week = document.getElementById('weekSelect').value;
    
    if(!group || !week) {
        alert('يرجى اختيار المجموعة والأسبوع');
        return;
    }

    // هنا يمكن إضافة كود جلب البيانات من Firebase وتصديرها
    const data = [
        ['رقم_الجلوس', 'اسم_الطالب', 'المجموعة', 'الدرجة', 'ملاحظات']
        // إضافة البيانات من Firebase
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "درجات الطلاب");
    XLSX.writeFile(wb, `درجات_المجموعة_${group}_الأسبوع_${week}.xlsx`);
}

// تحميل البيانات الأولية عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    fillWeeksList();
});