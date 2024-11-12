import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getDatabase, ref, get, set, push, child, query, orderByChild, equalTo, increment, onValue, remove, update } from 'firebase/database';

import { firebaseConfig } from '@/src/config/firebase-config';


// Initialize Firebase app
const app = initializeApp(firebaseConfig);
// Initialize Firebase Database
const database = getDatabase(app);
// Initialize Firebase Auth
const auth = getAuth(app);

// Function to handle user authentication
export const userSignIn = async () => {
	try {
		await signInAnonymously(auth);
	} catch (error) {
		console.error('Firebase auth error:', error);
		throw error;
	}
};


// Export necessary Firebase functionalities
export { database, auth, ref, get, set, push, child, query, orderByChild, equalTo, increment, onValue, remove, update };
