// import { Tabs } from 'expo-router';
// import { ShoppingBag, MessageCircle, User, CirclePlus as PlusCircle } from 'lucide-react-native';
// import { TouchableOpacity, StyleSheet } from 'react-native';
// import { useNavigation, NavigationProp } from '@react-navigation/native';

// export default function TabLayout() {
//   const navigation = useNavigation<NavigationProp<any>>();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: '#5FD4C3',
//         tabBarInactiveTintColor: '#888',
//         tabBarStyle: {
//           borderTopWidth: 1,
//           borderTopColor: '#F0F0F0',
//         },
//         tabBarLabelStyle: {
//           fontFamily: 'Inter-Medium',
//           fontSize: 12,
//         },
//         headerShown: true,
//         headerStyle: {
//           backgroundColor: '#FFF',
//         },
//         headerTitleStyle: {
//           fontFamily: 'Inter-Bold',
//           fontSize: 18,
//         },
//         headerShadowVisible: false,
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Marketplace',
//           tabBarIcon: ({ color, size }) => (
//             <ShoppingBag size={size} color={color} />
//           ),
//           headerRight: () => (
//             <TouchableOpacity
//               style={styles.headerButton}
//               onPress={() => navigation.navigate('/(tabs)/create-listing')}
//             >
//               <PlusCircle size={24} color="#5FD4C3" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="forum"
//         options={{
//           title: 'Forum',
//           tabBarIcon: ({ color, size }) => (
//             <MessageCircle size={size} color={color} />
//           ),
//           headerRight: () => (
//             <TouchableOpacity
//               style={styles.headerButton}
//               onPress={() => navigation.navigate('/(tabs)/create-post')}
//             >
//               <PlusCircle size={24} color="#5FD4C3" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, size }) => (
//             <User size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="create-listing"
//         options={{
//           title: 'New Listing',
//           tabBarButton: () => null, // Hide this tab
//           headerLeft: () => (
//             <TouchableOpacity
//               style={styles.headerButton}
//               onPress={() => navigation.goBack()}
//             >
//               <PlusCircle size={24} color="#000" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="create-post"
//         options={{
//           title: 'New Forum Post',
//           tabBarButton: () => null, // Hide this tab
//           headerLeft: () => (
//             <TouchableOpacity
//               style={styles.headerButton}
//               onPress={() => navigation.goBack()}
//             >
//               <PlusCircle size={24} color="#000" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="listing"
//         options={{
//           title: 'Listing Details',
//           tabBarButton: () => null, // Hide this tab
//           headerLeft: () => (
//             <TouchableOpacity
//               style={styles.headerButton}
//               onPress={() => navigation.goBack()}
//             >
//               <PlusCircle size={24} color="#000" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="forum-post"
//         options={{
//           title: 'Forum Post',
//           tabBarButton: () => null, // Hide this tab
//           headerLeft: () => (
//             <TouchableOpacity
//               style={styles.headerButton}
//               onPress={() => navigation.goBack()}
//             >
//               <PlusCircle size={24} color="#000" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   headerButton: {
//     marginRight: 16,
//   },
// });







import { Tabs } from 'expo-router';
import { ShoppingBag, MessageCircle, User, CirclePlus } from 'lucide-react-native';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/services/userService'; // assuming you have this
import { useEffect, useState } from 'react';

export default function TabLayout() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setIsSeller(profile?.isSeller || false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleCreateListingPress = () => {
    if (!user) {
      alert('You must be logged in.');
      return;
    }

    if (!isSeller) {
      alert('You must complete seller onboarding before creating listings.');
      return;
    }

    navigation.navigate('create-listing');
  };


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5FD4C3',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFF',
        },
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleCreateListingPress}
            >
              <CirclePlus size={24} color="#5FD4C3" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: 'Forum',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('create-post')}
            >
              <CirclePlus size={24} color="#5FD4C3" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 16,
  },
});
