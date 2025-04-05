const admin = require("firebase-admin");
require('dotenv').config();

// Use environment variables for Firebase service account
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')  // ✅ Ensure proper newline formatting
};

console.log('🔥 Firebase Config:', serviceAccount);

if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
  console.error('❌ Missing Firebase configuration in environment variables');
  process.exit(1);
}

// ✅ Check if Firebase app is already initialized before initializing
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase initialized successfully');
} else {
  console.log('⚠️ Firebase already initialized');
}

const db = admin.firestore();

module.exports = { db };
