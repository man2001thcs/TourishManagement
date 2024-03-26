importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js"
);

const firebaseConfig = {
  // to cut the chase, just copy it from your Firebase Project settings

  apiKey: "AIzaSyBD1bZG1liLvQjEczdm1wwI7bsD7yHG7gk",
  authDomain: "tourishproj.firebaseapp.com",
  projectId: "tourishproj",
  storageBucket: "tourishproj.appspot.com",
  messagingSenderId: "109256577871",
  appId: "1:109256577871:web:1ec764f11c838d9f02eb3a",
  measurementId: "G-HRVP4ZT17N",
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
