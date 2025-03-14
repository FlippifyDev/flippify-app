import admin from 'firebase-admin';

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') ?? "",  // Fix multi-line key format
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
    // Initialize Firebase Admin SDK with the service account credentials from environment variables
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const firestoreAdmin = admin.firestore();

export { firestoreAdmin };
