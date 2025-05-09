// testOnboard.js
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyBoLbJC7FIBs3Sn1in9RfxSMayZNPprEyQ",
    authDomain: "pawspace05.firebaseapp.com",
  projectId: 'pawspace05',
  appId: "1:1008472632376:web:5534eb6bb9cbead3bd8acd",
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const createOnboardingLink = httpsCallable(functions, 'createStripeOnboardingLink');

(async () => {
  try {
    const result = await createOnboardingLink({ uid: '01scM8VFmmN46o6DklGsZNz1EMi1' });
    console.log('Stripe onboarding URL:', result.data.url);
  } catch (error) {
    console.error('Error calling function:', error);
  }
})();
