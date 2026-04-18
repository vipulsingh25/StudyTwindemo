import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

 
const firebaseConfig = {
  apiKey: "AIzaSyAbGvsqdA9OYFS5_wlZfjruzZF19DIIrqE",
  authDomain: "studytwin-6de26.firebaseapp.com",
  projectId: "studytwin-6de26",
  storageBucket: "studytwin-6de26.firebasestorage.app",
  messagingSenderId: "693836922112",
  appId: "1:693836922112:web:a32470b48401161851c7e5",
  measurementId: "G-9ZHML82TDW"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)