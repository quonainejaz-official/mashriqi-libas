import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });
    const product = await Product.findById(params.id).populate('category', 'name').lean();
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const formData = await request.formData();
    const updateData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      category: formData.get('category'),
      subcategory: JSON.parse(formData.get('subcategory') || 'null'),
      sizes: JSON.parse(formData.get('sizes') || '[]'),
      colors: JSON.parse(formData.get('colors') || '[]'),
      isFeatured: formData.get('isFeatured') === 'true',
      isActive: formData.get('isActive') !== 'false',
      fabric: formData.get('fabric'),
      tags: JSON.parse(formData.get('tags') || '[]'),
    };

    if (formData.get('salePrice')) {
      updateData.salePrice = parseFloat(formData.get('salePrice'));
    }

    // Upload new images
    const imageFiles = formData.getAll('newImages');
    const existingImages = JSON.parse(formData.get('existingImages') || '[]');
    const newUploads = [];

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const buffer = await file.arrayBuffer();
        const base64 = `data:${file.type};base64,${Buffer.from(buffer).toString('base64')}`;
        const result = await uploadImage(base64);
        newUploads.push(result);
      }
    }

    updateData.images = [...existingImages, ...newUploads];

    const product = await Product.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json({ message: 'Product updated', product });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    for (const img of product.images) {
      if (img.publicId) await deleteImage(img.publicId);
    }

    await product.deleteOne();
    return NextResponse.json({ message: 'Product deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
