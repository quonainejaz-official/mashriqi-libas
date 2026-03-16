import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    const { error, user } = requireAuth(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const cart = await Cart.findOne({ user: user.id }).populate('items.product', 'name price images stock');
    return NextResponse.json({ cart: cart || { items: [], total: 0 } });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}
