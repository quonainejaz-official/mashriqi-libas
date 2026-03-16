import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('Admin orders GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const { orderId, status, note } = await request.json();

    const order = await Order.findOneAndUpdate(
      { orderId },
      { 
        $set: { status },
        $push: { statusHistory: { status, note, timestamp: new Date() } }
      },
      { new: true }
    );

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Admin order update error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
