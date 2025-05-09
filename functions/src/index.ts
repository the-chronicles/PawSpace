import * as functions from 'firebase-functions';
import { onCall, CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import express from 'express';
import * as bodyParser from 'body-parser';

admin.initializeApp();
setGlobalOptions({ region: 'us-central1', maxInstances: 1 });

const stripeSecret = process.env.STRIPE_SECRET || functions.config().stripe?.secret;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || functions.config().stripe?.webhook_secret;

if (!stripeSecret || !webhookSecret) {
  throw new Error('Missing Stripe config: stripe.secret or stripe.webhook_secret not set');
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2025-04-30.basil',
});



// === Stripe Onboarding (Callable Function) ===
export const createStripeOnboardingLink = onCall(
  async (request: CallableRequest): Promise<{ url: string }> => {
    console.log('Auth info:', request.auth);

    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError('unauthenticated', 'Authentication required.');
    }

    const userRef = admin.firestore().collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User not found in Firestore.');
    }

    const userData = userDoc.data()!;

    if (!userData.stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: userData.email,
      });

      await userRef.update({ stripeAccountId: account.id });
      userData.stripeAccountId = account.id;
    }

    const accountLink = await stripe.accountLinks.create({
      account: userData.stripeAccountId,
      refresh_url: 'exp://192.168.104.206:8081/--/profile',
      return_url: 'exp://192.168.104.206:8081/--/profile',
      type: 'account_onboarding',
    });

    return { url: accountLink.url };
  }
);

// === Stripe Webhook (Express App Setup) ===
const app = express();

// Middleware to handle raw body for webhooks
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('❌ Stripe webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'account.updated') {
    const account = event.data.object as Stripe.Account;

    if (account.charges_enabled) {
      const usersRef = admin.firestore().collection('users');
      const snapshot = await usersRef
        .where('stripeAccountId', '==', account.id)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await userDoc.ref.update({ isSeller: true });
        console.log(`✅ User ${userDoc.id} is now a seller.`);
      }
    }
  }

  res.status(200).send('✅ Webhook received');
});

// Export the Express app as a Firebase Function
export const handleStripeWebhook = functions.https.onRequest(app);