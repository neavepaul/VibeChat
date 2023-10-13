// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const SUCCESS = "success";
const ERROR = "error";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWyTA5hm-mVbVifjdG7TSO2G_8YlNWfss",
    authDomain: "toxic-chat-9af47.firebaseapp.com",
    projectId: "toxic-chat-9af47",
    storageBucket: "toxic-chat-9af47.appspot.com",
    messagingSenderId: "369247048744",
    appId: "1:369247048744:web:6f6ca84ade549edd91d11d",
};

function createUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            console.log(userCredential);
            return SUCCESS;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorCode + " : " + errorMessage);
            return ERROR;
            // ..
        });
}

function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            return SUCCESS;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorCode + " : " + errorMessage);
            return ERROR;
        });
}

function googleAuth() {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            console.log(credential);
            return SUCCESS;
        })
        .catch((error) => {
            console.log(error);
            alert(error);
            return ERROR;
            // ...
        });
}

function logout() {
    return auth.signOut();
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const user = auth.currentUser;
const provider = new GoogleAuthProvider();
export { app, auth, user, createUser, googleAuth, loginUser, logout, db };
