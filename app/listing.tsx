import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, Share2, ArrowLeft, MessageCircle } from 'lucide-react-native';
import { getListingById } from '@/services/listingService';
import { ListingItem } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<ListingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getListingById(id);
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        Alert.alert('Error', 'Failed to load listing details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleContactSeller = () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to contact the seller.');
      return;
    }
    
    // In a real app, this would navigate to a chat screen or show contact info
    Alert.alert('Contact Seller', 'This feature will be implemented soon!');
  };

  const handlePurchase = () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to purchase this item.');
      return;
    }
    
    // In a real app, this would initiate Stripe payment flow
    Alert.alert('Purchase', 'This would open the Stripe payment flow.');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would save to Firebase
  };

  const handleShare = async () => {
    if (!listing) return;
    
    try {
      await Share.share({
        message: `Check out this item on PawSpace: ${listing.title} - $${listing.price}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5FD4C3" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Listing not found.</Text>
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
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: listing.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.backButtonOverlay}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.imageActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleFavorite}
            >
              <Heart 
                size={24} 
                color={isFavorite ? "#FF4D67" : "#FFF"} 
                fill={isFavorite ? "#FF4D67" : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Share2 size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{listing.title}</Text>
            <Text style={styles.price}>${listing.price.toFixed(2)}</Text>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Condition</Text>
              <Text style={styles.detailValue}>{listing.condition}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{listing.category}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerInitial}>
                  {listing.sellerName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.sellerDetails}>
                <Text style={styles.sellerName}>{listing.sellerName}</Text>
                <TouchableOpacity 
                  style={styles.viewProfileButton}
                  onPress={() => {
                    // Navigate to seller profile
                    Alert.alert('View Profile', 'This feature will be implemented soon!');
                  }}
                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={handleContactSeller}
        >
          <MessageCircle size={20} color="#5FD4C3" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.buyButton}
          onPress={handlePurchase}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
  backButton: {
    backgroundColor: '#5FD4C3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#5FD4C3',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#5FD4C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerInitial: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFF',
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  viewProfileButton: {
    alignSelf: 'flex-start',
  },
  viewProfileText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#5FD4C3',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#5FD4C3',
    borderRadius: 8,
    marginRight: 12,
  },
  messageButtonText: {
    fontFamily: 'Inter-Medium',
    color: '#5FD4C3',
    marginLeft: 8,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#5FD4C3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  buyButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    fontSize: 16,
  },
});