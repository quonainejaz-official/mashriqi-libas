import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { orderId } = params;
    const order = await Order.findOne({ orderId }).populate('user', 'name email').lean();
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
