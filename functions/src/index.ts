/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
// import { getFirebaseFunctions } from './config';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

admin.initializeApp();

exports.createStripeOnboardingLink = functions.https.onCall(async (data: any, context: any) => {
  const { uid } = data;

  if (!uid) throw new functions.https.HttpsError('invalid-argument', 'Missing UID.');

  const userDoc = await admin.firestore().collection('users').doc(uid).get();
  const userData = userDoc.data();

  if (!userData) throw new functions.https.HttpsError('not-found', 'User not found.');

  if (!userData.stripeAccountId) {
    const account = await stripe.accounts.create({ type: 'express', email: userData.email });
    await admin.firestore().collection('users').doc(uid).update({ stripeAccountId: account.id });
  }

  const accountLink = await stripe.accountLinks.create({
    account: userData.stripeAccountId,
    refresh_url: 'https://yourapp.com/profile', // Replace with your actual site
    return_url: 'https://yourapp.com/profile',
    type: 'account_onboarding',
  });

  return { url: accountLink.url };
});

exports.handleStripeWebhook = functions.https.onRequest(async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, 'YOUR_WEBHOOK_SIGNING_SECRET'); 
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'account.updated') {
    const account = event.data.object;

    if (account.charges_enabled) {
      const usersRef = admin.firestore().collection('users');
      const querySnapshot = await usersRef.where('stripeAccountId', '==', account.id).limit(1).get();

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await userDoc.ref.update({ isSeller: true });
        console.log(`User ${userDoc.id} is now a seller.`);
      }
    }
  }

  res.status(200).send('Received');
});
