import { useEffect } from "react";
import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { SplashScreen } from "expo-router";
import { FirebaseProvider } from "@/context/FirebaseContext";
import { StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { PlusCircle } from "lucide-react-native";

import { useNavigation, NavigationProp } from "@react-navigation/native";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigation = useNavigation<NavigationProp<any>>();

  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-Bold": Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <FirebaseProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
        <Stack.Screen
          name="create-listing"
          options={{
            title: "New Listing",
            headerShown: false,

            headerLeft: () => (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => navigation.goBack()}
              >
                <PlusCircle size={24} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="create-post" />
        <Stack.Screen name="listing" />
        <Stack.Screen name="forum-post" />
        <Stack.Screen name="onboard-seller" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="favorite" />
      </Stack>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        translucent={true}
        barStyle="dark-content"
      />
      {/* <StatusBar style="dark" /> */}
    </FirebaseProvider>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 16,
  },
});
