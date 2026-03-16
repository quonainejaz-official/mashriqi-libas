import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const { status, note } = await request.json();
    const order = await Order.findOneAndUpdate(
      { orderId: params.id },
      {
        $set: { status },
        $push: { statusHistory: { status, note, timestamp: new Date() } }
      },
      { new: true }
    );

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ message: 'Order status updated', order });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
