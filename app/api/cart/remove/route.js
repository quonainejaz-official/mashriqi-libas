import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    await connectDB();
    const { error, user } = requireAuth(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    const cart = await Cart.findOne({ user: user.id });
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();
    return NextResponse.json({ message: 'Item removed', cart });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}
