import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const category = await Category.findById(params.id);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const order = parseInt(formData.get('order')) || 0;
    const slug = name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : category.slug;
    const subcategoriesRaw = formData.get('subcategories');
    const subcategories = subcategoriesRaw ? JSON.parse(subcategoriesRaw) : [];

    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      if (category.image?.publicId) {
        await deleteImage(category.image.publicId);
      }
      const buffer = await imageFile.arrayBuffer();
      const base64 = `data:${imageFile.type};base64,${Buffer.from(buffer).toString('base64')}`;
      category.image = await uploadImage(base64);
    }

    category.name = name || category.name;
    category.slug = slug;
    category.description = description || '';
    category.order = order;
    if (subcategoriesRaw) {
      category.subcategories = subcategories.map((sub) => ({
        name: sub.name?.trim(),
        slug: sub.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        order: parseInt(sub.order) || 0,
        isActive: sub.isActive !== false,
      })).filter((sub) => sub.name);
    }

    await category.save();
    return NextResponse.json({ message: 'Category updated', category });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const category = await Category.findById(params.id);
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
