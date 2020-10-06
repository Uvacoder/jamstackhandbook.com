import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const WEBSITE_HOST = process.env.NEXT_PUBLIC_WEBSITE_HOST;
const PAYMENT_SUCCESS_PATH = '/success';
const PAYMENT_CANCEL_PATH = '/';

export async function initCheckout({ lineItems } = {}) {
  if ( !stripePromise ) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  const errorBase = 'Failed to initiate checkout';

  if ( !Array.isArray(lineItems) ) {
    throw new Error(`${errorBase}: lineItems is not an array`);
  }

  const stripe = await stripePromise;

  const { error } = await stripe.redirectToCheckout({
    mode: 'payment',
    lineItems,
    subscription_data: {
      coupon: 'JAMSTACKCONF2020'
    },
    successUrl: `${WEBSITE_HOST}${PAYMENT_SUCCESS_PATH}?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${WEBSITE_HOST}${PAYMENT_CANCEL_PATH}`,
  });

  if ( error ) {
    throw new Error(error);
  }

}