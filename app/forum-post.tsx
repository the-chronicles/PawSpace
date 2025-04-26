import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send, Heart, Share2 } from 'lucide-react-native';
import { getForumPostById, addCommentToPost } from '@/services/forumService';
import { ForumPost, ForumComment } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function ForumPostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getForumPostById(id);
        setPost(data.post);
        setComments(data.comments);
      } catch (error) {
        console.error('Error fetching forum post:', error);
        Alert.alert('Error', 'Failed to load forum post details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to add a comment.');
      return;
    }
    if (!post) return;

    try {
      setIsSubmitting(true);
      
      const comment: Omit<ForumComment, 'id' | 'createdAt'> = {
        postId: post.id,
        content: newComment,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
      };
      
      const newCommentId = await addCommentToPost(comment);
      
      // Add the new comment to the local state
      const newCommentObject: ForumComment = {
        ...comment,
        id: newCommentId,
        createdAt: Date.now(),
      };
      
      setComments([...comments, newCommentObject]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add your comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, this would save to Firebase
  };

  const handleShare = () => {
    // In a real app, this would use the Share API
    Alert.alert('Share', 'This feature will be implemented soon!');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5FD4C3" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Forum post not found.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={20} color="#333" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <View style={styles.postMeta}>
              <View style={styles.authorContainer}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.authorInitial}>
                    {post.authorName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.authorName}>{post.authorName}</Text>
                  <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
                </View>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{post.category}</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.postContent}>{post.content}</Text>
          
          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleLike}
            >
              <Heart 
                size={20} 
                color={isLiked ? "#FF4D67" : "#666"} 
                fill={isLiked ? "#FF4D67" : "transparent"}
              />
              <Text style={styles.actionText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Share2 size={20} color="#666" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>
            Comments ({comments.length})
          </Text>
          
          {comments.length === 0 ? (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
            </View>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentAuthorContainer}>
                    <View style={styles.commentAuthorAvatar}>
                      <Text style={styles.commentAuthorInitial}>
                        {comment.authorName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.commentAuthorName}>{comment.authorName}</Text>
                  </View>
                  <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!newComment.trim() || isSubmitting) && styles.sendButtonDisabled
          ]}
          onPress={handleAddComment}
          disabled={!newComment.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Send size={20} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 16,
    
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  postHeader: {
    marginBottom: 16,
  },
  postTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5FD4C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  authorInitial: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFF',
  },
  authorName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  postDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#888',
  },
  categoryBadge: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#0066CC',
  },
  postContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  commentsContainer: {
    padding: 16,
  },
  commentsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  noCommentsContainer: {
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    alignItems: 'center',
  },
  noCommentsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  commentItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAuthorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  commentAuthorInitial: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#FFF',
  },
  commentAuthorName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  commentDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#888',
  },
  commentContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5FD4C3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
});