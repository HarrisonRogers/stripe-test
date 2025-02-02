'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/utils/supabaseClient';
import toast from 'react-hot-toast';

function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        toast.error('Please login to checkout');
        return;
      }
      setLoading(true);

      const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          email: data.user.email,
          userId: data.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Checkout API Error:', errorData);
        throw new Error(`Network response was not ok: ${errorData}`);
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'An error occurred while processing your request'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Signup for a Plan</h1>
      <p>Clicking this button creates a new Stripe Checkout Session</p>
      <button className="btn btn-accent" onClick={handleCheckout}>
        {loading ? 'Loading...' : 'Buy Now'}
      </button>
    </div>
  );
}

export default CheckoutButton;
