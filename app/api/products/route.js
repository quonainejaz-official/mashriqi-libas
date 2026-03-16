import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const sort = searchParams.get('sort') || 'createdAt';
    const featured = searchParams.get('featured');
    const subcategory = searchParams.get('subcategory');

    const query = { isActive: true };

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const categoryDoc = await Category.findOne({ slug: category }).select('_id');
        if (!categoryDoc) {
          return NextResponse.json({
            products: [],
            pagination: { total: 0, page, pages: 0, limit }
          });
        }
        query.category = categoryDoc._id;
      }
    }
    if (featured === 'true') query.isFeatured = true;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (size) query.sizes = size;
    if (color) query['colors.name'] = { $regex: color, $options: 'i' };
    if (subcategory) query['subcategory.slug'] = subcategory;

    const sortOptions = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      newest: { createdAt: -1 },
      popular: { sold: -1 },
    };

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
