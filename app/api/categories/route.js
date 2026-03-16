import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { NextResponse } from 'next/server';

const normalizeNodes = (nodes = []) =>
  nodes
    .filter((node) => node.isActive !== false)
    .map((node) => ({
      ...node,
      subcategories: normalizeNodes(node.subcategories || []).sort((a, b) => (a.order || 0) - (b.order || 0))
    }));

export async function GET(request) {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
    const normalized = categories.map((category) => ({
      ...category,
      subcategories: normalizeNodes(category.subcategories || []).sort((a, b) => (a.order || 0) - (b.order || 0))
    }));
    return NextResponse.json({ categories: normalized });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
