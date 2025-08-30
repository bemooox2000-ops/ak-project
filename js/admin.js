// التحقق من حالة تسجيل الدخول
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // التحقق من الصلاحيات
    const adminDoc = await db.collection('admins').doc(user.uid).get();
    if (!adminDoc.exists) {
        auth.signOut();
        return;
    }
    
    // تحميل البيانات
    loadInitialData();
});

// تحميل البيانات من Firebase
async function loadInitialData() {
    students: [
        { id: "12345", name: "أحمد محمد", group: "المجموعة الأولى" },
        { id: "12346", name: "سارة أحمد", group: "المجموعة الثانية" }
    ],
    groups: [
        { name: "المجموعة الأولى", count: 15 },
        { name: "المجموعة الثانية", count: 12 }
    ],
    grades: {
        "12345": [
            { week: 1, score: 45, maxScore: 50, notes: "ممتاز" },
            { week: 2, score: 47, maxScore: 50, notes: "جيد جداً" }
        ],
        "12346": [
            { week: 1, score: 48, maxScore: 50, notes: "ممتاز" },
            { week: 2, score: 46, maxScore: 50, notes: "جيد جداً" }
        ]
    }
};

// إدارة التنقل بين الصفحات
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        
        // إخفاء كل الصفحات
        document.querySelectorAll('[id$="Page"]').forEach(page => {
            page.style.display = 'none';
        });
        
        // إظهار الصفحة المطلوبة
        document.getElementById(page + 'Page').style.display = 'block';
        
        // تحديث القائمة النشطة
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
        
        // تحديث البيانات
        updatePageData(page);
    });
});

// تحديث بيانات الصفحات
function updatePageData(page) {
    switch(page) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'students':
            updateStudentsTable();
            break;
        case 'groups':
            updateGroupsTable();
            break;
        case 'grades':
            updateGradesTable();
            break;
    }
}

// تحديث لوحة التحكم
function updateDashboard() {
    document.getElementById('totalStudents').textContent = adminData.students.length;
    document.getElementById('totalGroups').textContent = adminData.groups.length;
    
    // حساب متوسط الدرجات
    let totalScore = 0;
    let totalMaxScore = 0;
    Object.values(adminData.grades).forEach(studentGrades => {
        studentGrades.forEach(grade => {
            totalScore += grade.score;
            totalMaxScore += grade.maxScore;
        });
    });
    const averageGrade = ((totalScore / totalMaxScore) * 100).toFixed(1);
    document.getElementById('averageGrade').textContent = averageGrade + '%';
    
    // حساب نسبة النجاح (نفترض أن درجة النجاح 60%)
    let passCount = 0;
    Object.values(adminData.grades).forEach(studentGrades => {
        const studentTotal = studentGrades.reduce((acc, grade) => acc + grade.score, 0);
        const studentMax = studentGrades.reduce((acc, grade) => acc + grade.maxScore, 0);
        if ((studentTotal / studentMax) >= 0.6) passCount++;
    });
    const passRate = ((passCount / Object.keys(adminData.grades).length) * 100).toFixed(1);
    document.getElementById('passRate').textContent = passRate + '%';
}

// تحديث جدول الطلاب
function updateStudentsTable() {
    const tbody = document.querySelector('#studentsTable tbody');
    tbody.innerHTML = '';
    
    adminData.students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.group}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editStudent('${student.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// تحديث جدول المجموعات
function updateGroupsTable() {
    const tbody = document.querySelector('#groupsTable tbody');
    tbody.innerHTML = '';
    
    adminData.groups.forEach(group => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${group.name}</td>
            <td>${group.count}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editGroup('${group.name}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteGroup('${group.name}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// تحديث جدول الدرجات
function updateGradesTable() {
    // تحديث قائمة المجموعات
    const groupSelect = document.getElementById('groupSelect');
    groupSelect.innerHTML = '<option value="">اختر المجموعة</option>';
    adminData.groups.forEach(group => {
        groupSelect.innerHTML += `<option value="${group.name}">${group.name}</option>`;
    });
    
    // تحديث قائمة الأسابيع
    const weekSelect = document.getElementById('weekSelect');
    weekSelect.innerHTML = '<option value="">اختر الأسبوع</option>';
    for(let i = 1; i <= 4; i++) {
        weekSelect.innerHTML += `<option value="${i}">الأسبوع ${i}</option>`;
    }
}

// تسجيل الخروج
document.getElementById('logoutBtn').addEventListener('click', function() {
    if(confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        window.location.href = 'admin-login.html';
    }
});

// تحميل البيانات الأولية
updateDashboard();