import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCcYbphsYmrAFkdK40oH0SXP4ZNc570czs",
  authDomain: "login-auth-61a5a.firebaseapp.com",
  projectId: "login-auth-61a5a",
  storageBucket: "login-auth-61a5a.firebasestorage.app",
  messagingSenderId: "751848397501",
  appId: "1:751848397501:web:858c862e424a92213b75d4"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();