import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJaHC3D1jz3qmM0-w8zFGSwGIm7NncmNw",
  authDomain: "pawspace-17c8d.firebaseapp.com",
  projectId: "pawspace-17c8d",
  // storageBucket: "pawspace-17c8d.firebasestorage.app",
  storageBucket: "pawspace-17c8d.appspot.com",
  messagingSenderId: "156252587696",
  appId: "1:156252587696:web:6bd25ff715d07618429d75"
};

export function initializeFirebase() {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
}

export const getFirebaseApp = () => {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
};

export const getFirebaseFirestore = () => {
  const app = getFirebaseApp();
  return getFirestore(app);
};

export const getFirebaseStorage = () => {
  const app = getFirebaseApp();
  return getStorage(app);
};

// export const getFirebaseAuth = () => {
//   const app = getFirebaseApp();
//   return getAuth(app);
// };

export const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  try {
    return getAuth(app); // In case it's already initialized
  } catch (error) {
    // If not already initialized, initialize with AsyncStorage persistence
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
};

export const getFirebaseFunctions = () => {
  const app = getFirebaseApp();
  return getFunctions(app);
};
