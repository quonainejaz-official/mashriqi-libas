import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search');

    const query = {};
    if (search) query.$text = { $search: search };

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);
    return NextResponse.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const salePrice = formData.get('salePrice') ? parseFloat(formData.get('salePrice')) : undefined;
    const sku = formData.get('sku');
    const category = formData.get('category');
    const subcategoryRaw = formData.get('subcategory');
    const subcategory = subcategoryRaw ? JSON.parse(subcategoryRaw) : null;
    const stock = parseInt(formData.get('stock'));
    const sizes = JSON.parse(formData.get('sizes') || '[]');
    const colors = JSON.parse(formData.get('colors') || '[]');
    const fabric = formData.get('fabric');
    const isFeatured = formData.get('isFeatured') === 'true';
    const tags = JSON.parse(formData.get('tags') || '[]');

    // Check SKU uniqueness
    const existing = await Product.findOne({ sku: sku.toUpperCase() });
    if (existing) return NextResponse.json({ error: 'SKU already exists' }, { status: 409 });

    // Upload images
    const imageFiles = formData.getAll('images');
    const uploadedImages = [];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const buffer = await file.arrayBuffer();
        const base64 = `data:${file.type};base64,${Buffer.from(buffer).toString('base64')}`;
        const result = await uploadImage(base64);
        uploadedImages.push(result);
      }
    }

    const product = await Product.create({
      name, description, price, salePrice, sku, category, stock,
      sizes, colors, fabric, isFeatured, tags, images: uploadedImages, subcategory,
    });

    return NextResponse.json({ message: 'Product created', product }, { status: 201 });
  } catch (err) {
    console.error('Admin product create error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}
