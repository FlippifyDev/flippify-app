import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, get, child, set } from 'firebase/database'; // Import specific database functions

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

// Get a reference to the database service
const database = getDatabase(app);

export { database, ref, push, get, child, set }; // Export database and database functions
