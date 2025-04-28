import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  LogOut,
  Settings,
  CreditCard as Edit,
  Package,
  MessageCircle,
  CreditCard,
} from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
import { getUserListings } from "@/services/listingService";
import { getUserProfile } from "@/services/userService";
import { ListingItem, UserProfile } from "@/types";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [activeTab, setActiveTab] = useState("listings");
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      console.log("Current user:", user);
      if (!user?.uid) return;
      try {
        setIsLoading(true);
        const profileData = await getUserProfile(user.uid);
        const userListings = await getUserListings(user.uid);
  
        setProfile(profileData);
        setListings(userListings);
  
        console.log("Fetched Profile:", profileData); // Log the profile data to check
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProfileData();
  }, [user]);
  

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "This feature will be implemented soon!");
  };

  const handleListingPress = (id: string) => {
    router.push({
      pathname: "/listing",
      params: { id },
    });
  };

  const handleBecomeSeller = async () => {
    try {
      router.push("/onboard-seller");
    } catch (error) {
      console.error("Error starting seller onboarding:", error);
      Alert.alert("Error", "Could not start seller onboarding.");
    }
  };

  const renderListingItem = ({ item }: { item: ListingItem }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => handleListingPress(item.id)}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.listingImage}
        resizeMode="cover"
      />
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text style={styles.listingPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleSettingsPress = () => {
    router.push("/settings"); // Navigate to settings or favorites page
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5FD4C3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
          <Settings size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{
            uri:
              profile?.photoURL ||
              "https://images.pexels.com/photos/3198013/pexels-photo-3198013.jpeg",
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {profile?.displayName || user?.displayName || "User"}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Edit size={16} color="#FFF" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* Become a Seller Button */}
          {profile?.isSeller ? null : (
            <TouchableOpacity
              style={styles.becomeSellerButton}
              onPress={handleBecomeSeller}
            >
              <CreditCard size={16} color="#FFF" />
              <Text style={styles.editButtonText}>Become a Seller</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{listings.length}</Text>
          <Text style={styles.statLabel}>Listings</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Sales</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Forum Posts</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "listings" && styles.activeTab]}
          onPress={() => setActiveTab("listings")}
        >
          <Package
            size={20}
            color={activeTab === "listings" ? "#5FD4C3" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "listings" && styles.activeTabText,
            ]}
          >
            My Listings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "posts" && styles.activeTab]}
          onPress={() => setActiveTab("posts")}
        >
          <MessageCircle
            size={20}
            color={activeTab === "posts" ? "#5FD4C3" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "posts" && styles.activeTabText,
            ]}
          >
            My Posts
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "listings" ? (
        listings.length > 0 ? (
          <FlatList
            data={listings}
            renderItem={renderListingItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.listingsRow}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You don't have any listings yet.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                if (profile?.isSeller) {
                  router.push("/create-listing");
                } else {
                  Alert.alert(
                    "Become a Seller",
                    "You need to complete seller onboarding before listing items.",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Start Onboarding", onPress: handleBecomeSeller },
                    ]
                  );
                }
              }}
            >
              <Text style={styles.createButtonText}>Create a Listing</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You don't have any forum posts yet.
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/create-post")}
          >
            <Text style={styles.createButtonText}>Create a Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0F0",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: "#5FD4C3",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  editButtonText: {
    fontFamily: "Inter-Medium",
    color: "white",
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#5FD4C3",
  },
  tabText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#5FD4C3",
  },
  listingsRow: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listingCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  listingImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#F0F0F0",
  },
  listingInfo: {
    padding: 12,
  },
  listingTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    marginBottom: 4,
  },
  listingPrice: {
    fontFamily: "Inter-Bold",
    fontSize: 14,
    color: "#5FD4C3",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: "#5FD4C3",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  createButtonText: {
    fontFamily: "Inter-Bold",
    color: "white",
  },
  becomeSellerButton: {
    backgroundColor: "#5FD4C3",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 8,
  },
});
