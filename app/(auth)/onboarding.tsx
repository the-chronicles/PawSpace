import { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { PawPrint, ShoppingBag, MessageCircle } from 'lucide-react-native';
import React from 'react';

interface Slide {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  image: string | JSX.Element;
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Welcome to PawSpace',
    description: 'Your one-stop marketplace for pre-loved pet items. Give your furry friends the best without breaking the bank.',
    icon: <Image source={require('@/assets/images/pawv2.png')} style={{ width:40, height:40, resizeMode:"center" }} />,
    image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg',
  },
  {
    id: '2',
    title: 'Buy & Sell Pet Items',
    description: 'List your unused pet supplies or find great deals on quality items. Our secure platform makes transactions safe and easy.',
    icon: <ShoppingBag size={48} color="#5FD4C3" />,
    image: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg'
  },
  {
    id: '3',
    title: 'Join the Community',
    description: 'Connect with fellow pet parents, share experiences, and get advice from our vibrant community forum.',
    icon: <MessageCircle size={48} color="#5FD4C3" />,
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width: screenWidth }]}>
      <View style={styles.imageContainer}>
        {typeof item.image === 'string' ? (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          item.image
        )}
        <View style={styles.overlay} />
        <View style={styles.iconContainer}>
          {item.icon}
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / screenWidth
          );
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  slide: {
    flex: 1,
  },
  imageContainer: {
    height: '60%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  iconContainer: {
    position: 'absolute',
    bottom: -24,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#5FD4C3',
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontFamily: 'Inter-Medium',
    color: '#666',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#5FD4C3',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  nextButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    fontSize: 16,
  },
});