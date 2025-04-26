import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { createForumPost } from '@/services/forumService';
import { useAuth } from '@/hooks/useAuth';

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title || !content || !category) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    if (!user) {
      Alert.alert('Authentication Error', 'You must be logged in to create a post.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create forum post in Firebase
      await createForumPost({
        title,
        content,
        category,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
      });

      Alert.alert(
        'Success!',
        'Your forum post has been created successfully.',
        [
          { 
            text: 'OK', 
            onPress: () => router.push('/(tabs)/forum') 
          }
        ]
      );
    } catch (error) {
      console.error('Error creating forum post:', error);
      Alert.alert('Error', 'There was a problem creating your post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = ['Question', 'Discussion', 'Advice', 'Story', 'Other'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Create a Forum Post</Text>
        
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Give your post a title"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What would you like to discuss or ask?"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={Platform.OS === 'ios' ? 0 : 6}
          maxLength={2000}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.optionsContainer}>
          {categoryOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                category === option && styles.selectedOption
              ]}
              onPress={() => setCategory(option)}
            >
              <Text style={[
                styles.optionText,
                category === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Create Post</Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.guidelines}>
          Community Guidelines: Be respectful, avoid offensive content, and do not share personal contact information in public posts.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  textArea: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#5FD4C3',
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: '#FFF',
  },
  submitButton: {
    backgroundColor: '#5FD4C3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    color: 'white',
    fontSize: 16,
  },
  guidelines: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});