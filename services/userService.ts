import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/firebase/config';
import { UserProfile } from '@/types';

export async function getUserProfile(userId: string, userAuthData?: { displayName: string | null, email: string | null, photoURL: string | null }): Promise<UserProfile> {
  const db = getFirebaseFirestore();
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  } else {
    // Profile does not exist → create one if userAuthData is available
    if (userAuthData) {
      const newProfile: UserProfile = {
        uid: userId,
        displayName: userAuthData.displayName || 'New User',
        email: userAuthData.email || 'noemail@example.com',
        photoURL: userAuthData.photoURL || null,
        createdAt: Date.now(),
      };

      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      throw new Error('User profile not found and no auth data to create one.');
    }
  }
}
