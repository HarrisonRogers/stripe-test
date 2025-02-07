import { NextResponse, NextRequest } from 'next/server';
import { stripe } from '@/utils/stripe';
import { supabase } from '@/utils/supabaseServer';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    // Log the incoming request path for debugging
    console.log('Webhook received at:', req.url);

    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('No stripe signature found');
      return NextResponse.json(
        { error: 'No stripe signature found' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_KEY) {
      console.error('Missing STRIPE_WEBHOOK_KEY environment variable');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_KEY
      );
      console.log('Webhook event type:', event.type);
    } catch (error) {
      console.error(`Webhook signature verification failed:`, error);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;

      if (!userId) {
        console.error('No user_id found in session metadata');
        return NextResponse.json(
          { error: 'Missing user_id in session metadata' },
          { status: 400 }
        );
      }

      const { error } = await supabase.from('stripe_customers').upsert({
        user_id: userId,
        stripe_customer_id: session.customer,
        subscription_id: session.subscription,
        plan_active: true,
        plan_expires: null,
      });

      if (error) {
        console.error('Error updating stripe_customers table:', error);
        return NextResponse.json(
          { error: 'Error updating stripe_customers table' },
          { status: 500 }
        );
      }

      console.log(
        'Successfully processed checkout.session.completed for user:',
        userId
      );
    }

    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
