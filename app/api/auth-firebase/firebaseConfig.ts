import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push, child, query, orderByChild, equalTo, increment, onValue, remove, update } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Database
const database = getDatabase(app);

// Initialize Firebase Auth
const auth = getAuth(app);

// Function to handle user authentication and return cleaned customer ID
export const handleUser = async (customerId: string) => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    const cleanedCustomerId = customerId.replace("cus_", ""); // Clean the customer ID
    return { uid: user.uid, customerId: cleanedCustomerId };
  } catch (error) {
    console.error('Firebase auth error:', error);
    throw error;
  }
};

// Function to update user data in Firebase
export const updateUserInFirebase = async (
  customerId: string, 
  email: string, 
  currency: string, 
  emailKey: string = 'preferredEmail'
) => {
  try {
    const userRef = ref(database, `users/${customerId}`);
    await set(userRef, { [emailKey]: email, currency });
  } catch (error) {
    console.error('Error updating Firebase user:', error);
    throw error;
  }
};

// Export necessary Firebase functionalities
export { database, auth, ref, get, set, push, child, query, orderByChild, equalTo, increment, onValue, remove, update };
