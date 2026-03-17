import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { deleteImage, uploadImage } from '@/lib/cloudinary';
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

    const contentType = request.headers.get('content-type');
    let updateData = {};
    let previousImagePublicId = null;

    if (contentType?.includes('multipart/form-data')) {
      const existingUser = await User.findById(user.id).select('image');
      previousImagePublicId = existingUser?.image?.public_id || null;
      const formData = await request.formData();
      const name = formData.get('name');
      const phone = formData.get('phone');
      const address = JSON.parse(formData.get('address') || '{}');
      const imageFile = formData.get('image');

      updateData = {
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

      if (imageFile && typeof imageFile !== 'string') {
        const buffer = await imageFile.arrayBuffer();
        const base64 = `data:${imageFile.type};base64,${Buffer.from(buffer).toString('base64')}`;
        const result = await uploadImage(base64);
        updateData.image = {
          url: result.url,
          public_id: result.publicId
        };
      }
    } else {
      const { name, phone, address } = await request.json();
      updateData = {
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
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!updatedUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (updateData.image?.public_id && previousImagePublicId && previousImagePublicId !== updateData.image.public_id) {
      try {
        await deleteImage(previousImagePublicId);
      } catch (error) {
        console.error('Image deletion failed:', error);
      }
    }
    return NextResponse.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
