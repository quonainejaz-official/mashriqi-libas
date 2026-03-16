import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    const { error, user } = requireAuth(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
