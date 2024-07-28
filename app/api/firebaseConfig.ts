import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push, child, query, orderByChild, equalTo, increment } from 'firebase/database';
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

export const handleUser = async (customerId: string) => {
  try {
    const auth = getAuth();  // Initialize the Firebase Auth
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    const cleanedcustomerId = customerId.replace("cus_", ""); // Apply the replace method correctly
    return { uid: user.uid, customerId: cleanedcustomerId };
  } catch (error) {
    console.error('Firebase auth error:', error);
    throw error;
  }
};

export { database, auth, ref, get, set, push, child, query, orderByChild, equalTo, increment };




/*
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push, child, query, orderByChild, equalTo, increment } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey:             process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL:        process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId:          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:              process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if firebaseConfig is correctly set
if (!firebaseConfig.apiKey) {
  throw new Error('Firebase configuration is missing');
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Database
const database = getDatabase(app);

// Initialize Firebase Auth
const auth = getAuth(app);
signInAnonymously(auth)
  .then(() => {
    // Sign in successful
  })
  .catch((error) => {
    console.error("Firebase auth error:", error.code, error.message);
  });

export { database, auth, ref, get, set, push, child, query, orderByChild, equalTo, increment };
*/