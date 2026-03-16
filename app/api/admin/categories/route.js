import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });
    const categories = await Category.find().sort({ order: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
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
    const order = parseInt(formData.get('order')) || 0;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const subcategoriesRaw = formData.get('subcategories');
    const subcategories = subcategoriesRaw ? JSON.parse(subcategoriesRaw) : [];

    let image = {};
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      const base64 = `data:${imageFile.type};base64,${Buffer.from(buffer).toString('base64')}`;
      image = await uploadImage(base64);
    }

    const normalizedSubcategories = subcategories.map((sub) => ({
      name: sub.name?.trim(),
      slug: sub.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      order: parseInt(sub.order) || 0,
      isActive: sub.isActive !== false,
    })).filter((sub) => sub.name);

    const category = await Category.create({ name, slug, description, image, order, subcategories: normalizedSubcategories });
    return NextResponse.json({ message: 'Category created', category }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });

    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    if (category.image?.publicId) {
      await deleteImage(category.image.publicId);
    }

    await category.deleteOne();
    return NextResponse.json({ message: 'Category deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
