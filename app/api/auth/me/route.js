import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { error } = requireAuth(request);
  if (error) return NextResponse.json({ error }, { status: 401 });

  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('token', '', { maxAge: 0, path: '/' });
  return response;
}

export async function GET(request) {
  try {
    await connectDB();
    const { error, user } = requireAuth(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const userData = await User.findById(user.id).select('-password');
    if (!userData) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user: userData });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const { error, user } = requireAuth(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { name, phone, address } = await request.json();
    const updateData = {
      name: name?.trim(),
      phone: phone?.trim(),
      address: {
        street: address?.street || '',
        city: address?.city || '',
        province: address?.province || address?.state || '',
        postalCode: address?.postalCode || '',
        country: address?.country || 'Pakistan'
      }
    };

    const updatedUser = await User.findByIdAndUpdate(user.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!updatedUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
