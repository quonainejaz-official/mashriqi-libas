import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    await connectDB();
    const { error, user } = requireAuth(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { itemId, quantity } = await request.json();
    const cart = await Cart.findOne({ user: user.id });
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    const item = cart.items.id(itemId);
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    item.quantity = quantity;
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();
    return NextResponse.json({ cart });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
