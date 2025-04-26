import { collection, addDoc, query, where, getDocs, doc, getDoc, orderBy, limit, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseFirestore, getFirebaseStorage } from '@/firebase/config';
import { ListingItem } from '@/types';

// Mock data for demo purposes
const MOCK_LISTINGS: ListingItem[] = [
  {
    id: '1',
    title: 'Dog Bed - Large',
    description: 'Comfortable large dog bed suitable for medium to large breeds. Only used for a few months, still in excellent condition.',
    price: 45.99,
    condition: 'Good',
    category: 'Beds',
    imageUrl: 'https://images.pexels.com/photos/6568941/pexels-photo-6568941.jpeg',
    sellerId: 'user1',
    sellerName: 'Jane Smith',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
  },
  {
    id: '2',
    title: 'Puppy Collar Set',
    description: 'Set of 3 adjustable puppy collars with matching leashes. My puppy outgrew these quickly. Perfect for small breeds.',
    price: 15.50,
    condition: 'Like New',
    category: 'Accessories',
    imageUrl: 'https://images.pexels.com/photos/1378849/pexels-photo-1378849.jpeg',
    sellerId: 'user2',
    sellerName: 'Mike Johnson',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
  },
  {
    id: '3',
    title: 'Automatic Dog Feeder',
    description: 'Programmable automatic dog feeder. Can be set for up to 4 meals per day. Works perfectly but we no longer need it.',
    price: 79.99,
    condition: 'Good',
    category: 'Food',
    imageUrl: 'https://images.pexels.com/photos/5731866/pexels-photo-5731866.jpeg',
    sellerId: 'user3',
    sellerName: 'Alex Chen',
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
  },
  {
    id: '4',
    title: 'Small Dog Toys Bundle',
    description: 'Collection of 8 small dog toys. Includes squeaky toys, rope toys, and chew toys. Gently used and sanitized.',
    price: 22.00,
    condition: 'Good',
    category: 'Toys',
    imageUrl: 'https://images.pexels.com/photos/33053/dog-young-dog-small-dog-maltese.jpg',
    sellerId: 'user4',
    sellerName: 'Sarah Williams',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
  },
  {
    id: '5',
    title: 'Dog Raincoat - Medium',
    description: 'Waterproof dog raincoat, size medium. Used only a few times, like new condition. Red color with reflective strips.',
    price: 18.75,
    condition: 'Like New',
    category: 'Clothes',
    imageUrl: 'https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg',
    sellerId: 'user1',
    sellerName: 'Jane Smith',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
  }
];

// In a real app, this would use Firestore
export async function getListings(): Promise<ListingItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return MOCK_LISTINGS;
}

export async function getListingById(id: string): Promise<ListingItem> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find the listing by ID
  const listing = MOCK_LISTINGS.find(item => item.id === id);
  
  if (!listing) {
    throw new Error('Listing not found');
  }
  
  return listing;
}

export async function getUserListings(userId: string): Promise<ListingItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Filter listings by seller ID
  return MOCK_LISTINGS.filter(item => item.sellerId === userId);
}

// This would be an actual Firebase implementation in a real app
export async function createListing(listing: Omit<ListingItem, 'id' | 'createdAt'>): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, we would upload the image to Firebase Storage
  // and add the listing to Firestore
  
  // Create a mock ID
  const newId = (Math.random() * 1000000).toString();
  
  console.log('Created listing:', { ...listing, id: newId, createdAt: Date.now() });
  
  return newId;
}

// Upload an image to Firebase Storage (for real implementation)
export async function uploadListingImage(userId: string, imageUri: string): Promise<string> {
  const storage = getFirebaseStorage();
  
  // Create a unique filename
  const filename = `listings/${userId}/${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);
  
  // Fetch the image and convert to blob
  const response = await fetch(imageUri);
  const blob = await response.blob();
  
  // Upload to Firebase Storage
  await uploadBytes(storageRef, blob);
  
  // Get the download URL
  const downloadUrl = await getDownloadURL(storageRef);
  
  return downloadUrl;
}