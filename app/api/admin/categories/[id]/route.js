import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

const slugify = (value) => value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const normalizeSubcategories = (items = []) =>
  items
    .map((sub) => {
      if (!sub?.name?.trim()) return null;
      return {
        name: sub.name.trim(),
        slug: slugify(sub.name),
        description: sub.description || '',
        image: sub.image || {},
        order: parseInt(sub.order, 10) || 0,
        isActive: sub.isActive !== false,
        subcategories: normalizeSubcategories(sub.subcategories || [])
      };
    })
    .filter(Boolean);

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
    const orderRaw = formData.get('order');
    const order = orderRaw === null ? category.order : parseInt(orderRaw, 10) || 0;
    const slug = name ? slugify(name) : category.slug;
    const isActiveRaw = formData.get('isActive');
    const isActive = isActiveRaw === null ? category.isActive : isActiveRaw === 'true' || isActiveRaw === true;
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
    category.description = description === null ? category.description : description;
    category.order = order;
    category.isActive = isActive;
    if (subcategoriesRaw) {
      category.subcategories = normalizeSubcategories(subcategories);
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
