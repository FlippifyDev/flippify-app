import { getDatabase } from 'firebase/database';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/src/config/firebase-config';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut, User } from 'firebase/auth';


let app;
// Initialize Firebase app
if (!getApps().length) {
	app = initializeApp(firebaseConfig)
}

// Initialize Firebase Auth
const auth = getAuth(app);
// Initialize Firebase Database
const database = getDatabase(app);


// Function to sign in user anonymously
const signInUser = async () => {
	try {
		const user = auth.currentUser;
		if (!user) {
			console.log("Signing in user to Firebase");
			await signInAnonymously(auth); // Sign in anonymously if not already signed in
		} else {
			console.log("User already signed in to Firebase");
		}
	} catch (error) {
		console.error('Firebase auth error:', error);
	}
};


// Function to manually sign out the user
const signOutUser = async () => {
	try {
		await signOut(auth);
	} catch (error) {
		console.error('Firebase auth sign out error:', error);
	}
};


// Export necessary Firebase functionalities
export { signInUser, signOutUser, database, auth };
