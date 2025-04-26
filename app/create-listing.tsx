import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X } from 'lucide-react-native';
import { createListing } from '@/services/listingService';
import { useAuth } from '@/hooks/useAuth';

export default function CreateListingScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || !condition || !category || !image) {
      Alert.alert('Missing Fields', 'Please fill in all fields and add an image.');
      return;
    }

    if (!user) {
      Alert.alert('Authentication Error', 'You must be logged in to create a listing.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create listing in Firebase
      await createListing({
        title,
        description,
        price: parseFloat(price),
        condition,
        category,
        imageUrl: image, // In a real app, you'd upload this to Firebase Storage first
        sellerId: user.uid,
        sellerName: user.displayName || 'Unknown User',
      });

      Alert.alert(
        'Success!',
        'Your listing has been created successfully.',
        [
          { 
            text: 'OK', 
            onPress: () => router.push('/(tabs)') 
          }
        ]
      );
    } catch (error) {
      console.error('Error creating listing:', error);
      Alert.alert('Error', 'There was a problem creating your listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const conditionOptions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  const categoryOptions = ['Toys', 'Food', 'Beds', 'Clothes', 'Accessories', 'Other'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Listing Details</Text>
        
        <View style={styles.imagePickerContainer}>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <X size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.imagePickerButton}
              onPress={pickImage}
            >
              <Camera size={32} color="#5FD4C3" />
              <Text style={styles.imagePickerText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="What are you selling?"
          value={title}
          onChangeText={setTitle}
          maxLength={50}
        />
        
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your item (condition, size, brand, etc.)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={Platform.OS === 'ios' ? 0 : 4}
          maxLength={500}
        />
        
        <Text style={styles.label}>Price ($)</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={price}
          onChangeText={text => setPrice(text.replace(/[^0-9.]/g, ''))}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Condition</Text>
        <View style={styles.optionsContainer}>
          {conditionOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                condition === option && styles.selectedOption
              ]}
              onPress={() => setCondition(option)}
            >
              <Text style={[
                styles.optionText,
                condition === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
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
            <Text style={styles.submitButtonText}>List Item for Sale</Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.disclaimer}>
          By listing this item, you agree to PawSpace's terms and conditions, including the 10% platform fee on successful sales.
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
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePickerButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
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
    minHeight: 120,
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
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
});