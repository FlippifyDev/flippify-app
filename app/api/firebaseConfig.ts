import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push, child, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDYmi2-ehzKrTF7R3CkS9dO7lMTTcFq7wQ",
  authDomain: "flippify-72c65.firebaseapp.com",
  databaseURL: "https://flippify-72c65-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "flippify-72c65",
  storageBucket: "flippify-72c65.appspot.com",
  messagingSenderId: "609627967246",
  appId: "1:609627967246:web:764c229f5bde971d44915f",
  measurementId: "G-WZ8ML6Y0M3"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

signInAnonymously(auth).catch((error) => {
  console.error('Error signing in anonymously', error);
});

export { database, auth, ref, get, set, push, child, query, orderByChild, equalTo };
