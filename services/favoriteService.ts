import { getFirebaseFirestore } from '@/firebase/config';
import { ListingItem } from '@/types';
import { collection, doc, setDoc, deleteDoc, getDoc, getDocs } from 'firebase/firestore';

export async function addToFavorites(userId: string, listingId: string) {
  const db = getFirebaseFirestore();
  const favoriteRef = doc(db, 'users', userId, 'favorites', listingId);

  await setDoc(favoriteRef, {
    listingId,
    createdAt: Date.now(),
  });
}

export async function removeFromFavorites(userId: string, listingId: string) {
  const db = getFirebaseFirestore();
  const favoriteRef = doc(db, 'users', userId, 'favorites', listingId);

  await deleteDoc(favoriteRef);
}

export async function isFavorite(userId: string, listingId: string): Promise<boolean> {
  const db = getFirebaseFirestore();
  const favoriteRef = doc(db, 'users', userId, 'favorites', listingId);

  const snapshot = await getDoc(favoriteRef);
  return snapshot.exists();
}


export async function getUserFavorites(userId: string): Promise<ListingItem[]> {
    const db = getFirebaseFirestore();
    const favoritesRef = collection(db, 'users', userId, 'favorites');
  
    const snapshot = await getDocs(favoritesRef);
  
    const favorites: ListingItem[] = [];
  
    for (const docSnap of snapshot.docs) {
      const listingId = docSnap.id;
      try {
        const listing = await getListingById(listingId); // reuse your function
        favorites.push(listing);
      } catch (error) {
        console.error('Error fetching listing from favorite:', error);
      }
    }
  
    return favorites;
  }
  