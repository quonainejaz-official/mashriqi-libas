import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const { error, user } = requireAuth(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { productId, quantity = 1, size, color } = await request.json();

    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (product.stock < quantity) return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });

    let cart = await Cart.findOne({ user: user.id });
    if (!cart) {
      cart = new Cart({ user: user.id, items: [], total: 0 });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images[0]?.url,
        quantity,
        size,
        color,
        sku: product.sku,
      });
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    return NextResponse.json({ message: 'Added to cart', cart });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}
