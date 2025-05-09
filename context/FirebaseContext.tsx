import { createContext, useState, useEffect, ReactNode } from 'react';
import { getFirebaseApp } from '@/firebase/config';
import { getUserProfile } from '@/services/userService';

import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

type FirebaseContextType = {
  isInitialized: boolean;
  isAuthReady: boolean;
  user: FirebaseUser | null;
};

export const FirebaseContext = createContext<FirebaseContextType>({
  isInitialized: false,
  isAuthReady: false,
  user: null,
});

type FirebaseProviderProps = {
  children: ReactNode;
};

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const app = getFirebaseApp();
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          setUser(firebaseUser);
          setIsAuthReady(true);

          if (firebaseUser) {
            try {
              // ✅ Ensure Firestore user profile exists
              await getUserProfile(firebaseUser.uid, {
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
              });
              console.log('Ensured Firestore user profile exists');
            } catch (err) {
              console.error('Error initializing user profile:', err);
            }
          }
        });

        setIsInitialized(true);

        return () => unsubscribe();
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        setIsInitialized(true);
        setIsAuthReady(true);
      }
    };

    initFirebase();
  }, []);

  return (
    <FirebaseContext.Provider value={{ isInitialized, isAuthReady, user }}>
      {children}
    </FirebaseContext.Provider>
  );
}
