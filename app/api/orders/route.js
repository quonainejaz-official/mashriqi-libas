import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const { error, user } = requireAuth(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { shippingAddress, paymentIntentId, items, total } = await request.json();

    if (!shippingAddress || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedShipping = {
      ...shippingAddress,
      province: shippingAddress.province || shippingAddress.state || '',
      name: shippingAddress.name || '',
      phone: shippingAddress.phone || ''
    };

    const normalizedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ error: 'Product not found in cart' }, { status: 404 });
      }
      const quantity = Number(item.quantity) || 1;
      if (product.stock < quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      normalizedItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        price: item.price || product.salePrice || product.price,
        quantity,
        size: item.size || item.selectedSize,
        color: item.color?.name || item.color || item.selectedColor?.name,
        image: item.image || product.images?.[0]?.url || product.images?.[0]
      });
    }

    for (const item of normalizedItems) {
      const updated = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, sold: item.quantity } }
      );
      if (!updated.modifiedCount) {
        return NextResponse.json({ error: 'Stock changed, please retry checkout' }, { status: 409 });
      }
    }

    const order = await Order.create({
      user: user.id,
      items: normalizedItems,
      total,
      subtotal: total - 200,
      shippingFee: 200,
      shippingAddress: normalizedShipping,
      paymentIntentId,
      paymentStatus: paymentIntentId ? 'paid' : 'pending',
      status: 'confirmed',
      statusHistory: [{ status: 'confirmed', note: 'Order placed successfully', timestamp: new Date() }],
    });

    // Clear cart
    await Cart.findOneAndDelete({ user: user.id });

    return NextResponse.json({ message: 'Order placed successfully', order }, { status: 201 });
  } catch (err) {
    console.error('Order create error:', err);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}

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
