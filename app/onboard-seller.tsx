import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { getFirebaseFunctions } from '@/firebase/config';
import { httpsCallable } from 'firebase/functions';


export default function OnboardSellerScreen() {
  const { user, isAuthReady } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    const startOnboarding = async () => {
      if (!user || !isAuthReady) return;
  
      try {
        const functions = getFirebaseFunctions();
        const createOnboardingLink = httpsCallable(functions, 'createStripeOnboardingLink');
        const response = await createOnboardingLink({ uid: user.uid });
  
        if (response.data?.url) {
          router.push(response.data.url);
        } else {
          throw new Error('Onboarding URL missing');
        }
      } catch (error) {
        console.error('Onboarding error:', error);
        Alert.alert('Error', 'Could not start onboarding.');
        router.back();
      }
    };
  
    startOnboarding();
  }, [user, isAuthReady]);
  

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#5FD4C3" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});




