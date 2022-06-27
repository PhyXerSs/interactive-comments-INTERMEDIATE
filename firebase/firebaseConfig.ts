import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
const firebaseConfig = {
    apiKey: "AIzaSyALtslL3_jLkCFmVnGNstrzB7Bw1NJAbTE",
    authDomain: "frontendmentorphyxerss.firebaseapp.com",
    databaseURL: "https://frontendmentorphyxerss-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "frontendmentorphyxerss",
    storageBucket: "frontendmentorphyxerss.appspot.com",
    messagingSenderId: "74395910493",
    appId: "1:74395910493:web:6a244a74d2731455ada8b4"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
