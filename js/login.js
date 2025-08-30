document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        // تسجيل الدخول باستخدام Firebase Authentication
        const userCredential = await auth.signInWithEmailAndPassword(username, password);
        
        // التحقق من صلاحيات المستخدم
        const userDoc = await db.collection('admins').doc(userCredential.user.uid).get();
        
        if (userDoc.exists) {
            window.location.href = 'admin.html';
        } else {
            alert('ليس لديك صلاحية الوصول للوحة التحكم');
            await auth.signOut();
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert('خطأ في تسجيل الدخول: ' + error.message);
    }
});