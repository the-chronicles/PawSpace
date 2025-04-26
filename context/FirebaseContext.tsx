import { createContext, useState, useEffect, ReactNode } from 'react';
import { initializeFirebase } from '@/firebase/config';
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
        // Initialize Firebase
        const app = initializeFirebase();
        const auth = getAuth(app);
        
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
          setIsAuthReady(true);
        });

        setIsInitialized(true);

        // Cleanup function
        return () => {
          unsubscribe();
        };
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