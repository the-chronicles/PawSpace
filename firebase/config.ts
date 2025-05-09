import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
// import { getAuth } from 'firebase/auth'; // ensure this is imported



import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBoLbJC7FIBs3Sn1in9RfxSMayZNPprEyQ",
  authDomain: "pawspace05.firebaseapp.com",
  projectId: "pawspace05",
  storageBucket: "pawspace05.appspot.com", // fix: should be `appspot.com`
  messagingSenderId: "1008472632376",
  appId: "1:1008472632376:web:5534eb6bb9cbead3bd8acd",
  measurementId: "G-P8YHBPZSGT"
};

// Ensure correct singleton pattern
export const getFirebaseApp = () => {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
};

export const getFirebaseFunctions = () => {
  const app = getFirebaseApp();
  const functions = getFunctions(app, 'us-central1');

  // Associate functions with current auth instance so tokens are passed
  // functions.auth = getAuth(app); // ✅ This makes functions use the signed-in user's token

  return functions;
};

export const getFirebaseFirestore = () => {
  return getFirestore(getFirebaseApp());
};

export const getFirebaseStorage = () => {
  return getStorage(getFirebaseApp());
};

// export const getFirebaseFunctions = () => {
//   return getFunctions(getFirebaseApp(), 'us-central1'); // <- fix here
// };

let authInitialized = false;
let authInstance: ReturnType<typeof getAuth>;

export const getFirebaseAuth = () => {
  if (authInitialized) return authInstance;

  const app = getFirebaseApp();

  try {
    authInstance = getAuth(app);
    authInitialized = true;
    return authInstance;
  } catch {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    authInitialized = true;
    return authInstance;
  }
};
