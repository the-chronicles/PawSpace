import { collection, addDoc, query, where, getDocs, doc, getDoc, orderBy, limit, Timestamp } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/firebase/config';
import { ForumPost, ForumComment } from '@/types';

// Mock data for demo purposes
const MOCK_POSTS: ForumPost[] = [
  {
    id: '1',
    title: 'Recommendations for dog food allergies?',
    content: 'My golden retriever has been showing signs of food allergies. Has anyone had success with any specific limited ingredient diets or brands? Looking for something readily available that won\'t break the bank.',
    authorId: 'user1',
    authorName: 'DogLover123',
    category: 'Advice',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    commentCount: 5,
  },
  {
    id: '2',
    title: 'Puppy training tips for apartment living',
    content: 'We just adopted a 3-month-old beagle puppy and live in a small apartment. Any tips for house training while keeping peace with the neighbors? Especially looking for advice on quiet play activities and potty training.',
    authorId: 'user2',
    authorName: 'NewPupParent',
    category: 'Question',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    commentCount: 3,
  },
  {
    id: '3',
    title: 'Anyone tried puzzle toys for dogs?',
    content: 'I\'m thinking about getting some puzzle toys to keep my dog mentally stimulated. Are they actually worth it? Any recommendations for particularly durable ones for aggressive chewers?',
    authorId: 'user3',
    authorName: 'SmartDogMom',
    category: 'Discussion',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    commentCount: 8,
  },
  {
    id: '4',
    title: 'Success story: Rescue dog transformation',
    content: 'I wanted to share our journey with our rescue dog, Max. When we got him 6 months ago, he was terrified of everything. After lots of patience, training, and love, he\'s now a confident and happy boy! If anyone is considering adoption but worried about behavioral issues, I\'d be happy to share our experience.',
    authorId: 'user4',
    authorName: 'RescueDad',
    category: 'Story',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    commentCount: 12,
  }
];

const MOCK_COMMENTS: Record<string, ForumComment[]> = {
  '1': [
    {
      id: 'c1',
      postId: '1',
      content: 'My dog had similar issues. We had success with Royal Canin Hypoallergenic. It\'s a bit pricey but worth it for us.',
      authorId: 'user5',
      authorName: 'PetNutritionist',
      createdAt: Date.now() - 2.5 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'c2',
      postId: '1',
      content: 'Have you tried eliminating chicken? That\'s a common allergen for dogs. We switched to a salmon-based food and saw improvement within weeks.',
      authorId: 'user6',
      authorName: 'VetAssistant',
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'c3',
      postId: '1',
      content: 'I\'d recommend doing an elimination diet under vet supervision. It was the only way we figured out our dog was allergic to beef AND chicken.',
      authorId: 'user7',
      authorName: 'DogDad42',
      createdAt: Date.now() - 1.5 * 24 * 60 * 60 * 1000,
    },
  ],
  '2': [
    {
      id: 'c4',
      postId: '2',
      content: 'We got a bell for our puppy to ring when she needs to go out. It took about 2 weeks to train but was a game changer!',
      authorId: 'user8',
      authorName: 'ApartmentDogTrainer',
      createdAt: Date.now() - 1.8 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'c5',
      postId: '2',
      content: 'For quiet play, puzzle toys and snuffle mats are great. Also, frozen Kongs can keep them busy for ages!',
      authorId: 'user9',
      authorName: 'QuietPlayExpert',
      createdAt: Date.now() - 1.2 * 24 * 60 * 60 * 1000,
    },
  ],
};

// In a real app, this would use Firestore
export async function getForumPosts(): Promise<ForumPost[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return MOCK_POSTS;
}

export async function getForumPostById(id: string): Promise<{ post: ForumPost, comments: ForumComment[] }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find the post by ID
  const post = MOCK_POSTS.find(item => item.id === id);
  
  if (!post) {
    throw new Error('Forum post not found');
  }
  
  // Get comments for this post
  const comments = MOCK_COMMENTS[id] || [];
  
  return { post, comments };
}

// This would be an actual Firebase implementation in a real app
export async function createForumPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'commentCount'>): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, we would add the post to Firestore
  
  // Create a mock ID
  const newId = (Math.random() * 1000000).toString();
  
  console.log('Created forum post:', { 
    ...post, 
    id: newId, 
    createdAt: Date.now(),
    commentCount: 0
  });
  
  return newId;
}

// This would be an actual Firebase implementation in a real app
export async function addCommentToPost(comment: Omit<ForumComment, 'id' | 'createdAt'>): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, we would add the comment to Firestore
  // and update the post's comment count
  
  // Create a mock ID
  const newId = `c${(Math.random() * 1000000).toString()}`;
  
  console.log('Added comment:', { 
    ...comment, 
    id: newId, 
    createdAt: Date.now() 
  });
  
  return newId;
}