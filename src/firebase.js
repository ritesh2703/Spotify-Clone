// src/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCcYbphsYmrAFkdK40oH0SXP4ZNc570czs",
  authDomain: "login-auth-61a5a.firebaseapp.com",
  projectId: "login-auth-61a5a",
  storageBucket: "login-auth-61a5a.firebasestorage.app",
  messagingSenderId: "751848397501",
  appId: "1:751848397501:web:858c862e424a92213b75d4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { 
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  facebookProvider
};