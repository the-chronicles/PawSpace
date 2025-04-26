// User types
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: number;
}

// Marketplace types
export interface ListingItem {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  createdAt: number;
}

// Forum types
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: string;
  createdAt: number;
  commentCount: number;
}

export interface ForumComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: number;
}