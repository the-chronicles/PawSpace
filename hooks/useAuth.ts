import { useState, useContext, useCallback } from 'react';
import { FirebaseContext } from '@/context/FirebaseContext';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { getFirebaseApp, getFirebaseAuth } from '@/firebase/config';
import { getUserProfile } from '@/services/userService';

export function useAuth() {
  const auth = getFirebaseAuth();
  const { user, isAuthReady } = useContext(FirebaseContext);
  const [isLoading, setIsLoading] = useState(false);

  // Login with email and password
  // Login with email and password
const login = useCallback(async (email: string, password: string) => {
  try {
    setIsLoading(true);
    const app = getFirebaseApp();
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, email, password);

    const user = auth.currentUser;

    if (user) {
      // 🔥 Ensure Firestore user profile exists
      await getUserProfile(user.uid, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to login');
  } finally {
    setIsLoading(false);
  }
}, []);


  // Sign up with email and password
 // Sign up with email and password
const signup = useCallback(async (email: string, password: string, displayName: string) => {
  try {
    setIsLoading(true);
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // Update user profile with display name
    await updateProfile(user, { displayName });

    // 🔥 Create Firestore user profile
    await getUserProfile(user.uid, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });

    return user;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Failed to sign up');
  } finally {
    setIsLoading(false);
  }
}, []);


  // Logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      const app = getFirebaseApp();
      const auth = getAuth(app);
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthReady,
    login,
    signup,
    logout,
  };
}