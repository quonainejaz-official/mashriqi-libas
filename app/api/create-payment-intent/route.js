import Stripe from 'stripe';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { error, user } = requireAuth(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paisa/cents
      currency: 'pkr',
      metadata: { userId: user.id },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Payment intent error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
