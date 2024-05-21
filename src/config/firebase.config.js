require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBS7MBE9iR-ef5yRfbOWjdM8OXQOMJQK7M",
//   authDomain: "toiec-test-c31f3.firebaseapp.com",
//   projectId: "toiec-test-c31f3",
//   storageBucket: "toiec-test-c31f3.appspot.com",
//   messagingSenderId: "689671145564",
//   appId: "1:689671145564:web:a9cd825f1541e14a73be99",
//   measurementId: "G-T9ZRD86MS5"
// };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage;
