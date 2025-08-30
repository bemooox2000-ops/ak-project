// البحث عن الطالب في Firebase
async function searchStudent(studentNumber) {
    try {
        const studentDoc = await db.collection('students').doc(studentNumber).get();
        if (studentDoc.exists) {
            const studentData = studentDoc.data();
            // جلب درجات الطالب
            const gradesSnapshot = await db.collection('grades')
                .where('studentId', '==', studentNumber)
                .orderBy('week')
                .get();
            
            const grades = [];
            gradesSnapshot.forEach(doc => {
                grades.push(doc.data());
            });
            
            return {
                name: studentData.name,
                group: studentData.group,
                grades: grades
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching student data:", error);
        throw error;
    }
}

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const studentNumber = document.getElementById('studentNumber').value;
    const student = studentsData[studentNumber];
    
    if (student) {
        showResults(student, studentNumber);
    } else {
        alert('لم يتم العثور على الطالب');
    }
});

function showResults(student, studentNumber) {
    // عرض معلومات الطالب
    document.getElementById('studentName').textContent = student.name;
    document.getElementById('studentId').textContent = studentNumber;
    document.getElementById('groupName').textContent = student.group;
    
    // عرض الدرجات
    const gradesTable = document.getElementById('gradesTable');
    gradesTable.innerHTML = '';
    
    let totalScore = 0;
    let totalMaxScore = 0;
    
    student.grades.forEach(grade => {
        const row = document.createElement('tr');
        const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);
        
        row.innerHTML = `
            <td>الأسبوع ${grade.week}</td>
            <td>${grade.score}</td>
            <td>${grade.maxScore}</td>
            <td>${percentage}%</td>
        `;
        
        gradesTable.appendChild(row);
        totalScore += grade.score;
        totalMaxScore += grade.maxScore;
    });
    
    // عرض المجموع
    const totalPercentage = ((totalScore / totalMaxScore) * 100).toFixed(1);
    document.getElementById('totalScore').textContent = 
        `${totalScore} من ${totalMaxScore} (${totalPercentage}%)`;
    
    // إظهار قسم النتائج
    document.getElementById('resultSection').style.display = 'block';
}