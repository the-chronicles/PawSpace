import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/firebase/config';
import { UserProfile } from '@/types';

// Mock data for demo purposes
const MOCK_USERS: Record<string, UserProfile> = {
  'user1': {
    uid: 'user1',
    displayName: 'Jane Smith',
    email: 'jane@example.com',
    photoURL: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  },
  'user2': {
    uid: 'user2',
    displayName: 'Mike Johnson',
    email: 'mike@example.com',
    photoURL: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
  },
};

// In a real app, this would use Firestore
export async function getUserProfile(userId: string): Promise<UserProfile> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data or a default profile
  return MOCK_USERS[userId] || {
    uid: userId,
    displayName: 'User',
    email: 'user@example.com',
    photoURL: null,
    createdAt: Date.now(),
  };
}

// This would be an actual Firebase implementation in a real app
export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, we would update the user document in Firestore
  console.log('Updated user profile:', { userId, ...profileData });
}