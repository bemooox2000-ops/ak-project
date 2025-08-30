// تهيئة Firebase
const firebaseConfig = {
    // قم بتغيير هذه القيم بالقيم الخاصة بمشروعك في Firebase
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// إنشاء مراجع لخدمات Firebase
const db = firebase.firestore();
const auth = firebase.auth();