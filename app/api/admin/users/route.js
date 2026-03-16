import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users });
  } catch (err) {
    console.error('Admin users GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const { error } = requireAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const { userId, isBlocked } = await request.json();

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    );

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'}`, user });
  } catch (err) {
    console.error('Admin user update error:', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
