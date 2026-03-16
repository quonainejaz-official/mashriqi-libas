import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  const cookies = request.headers.get('cookie');
  if (cookies) {
    const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1].trim();
    }
  }
  
  return null;
}

export function requireAuth(request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return { error: 'Unauthorized', user: null };
  }
  
  const user = verifyToken(token);
  if (!user) {
    return { error: 'Invalid token', user: null };
  }
  
  return { error: null, user };
}

export function requireAdmin(request) {
  const { error, user } = requireAuth(request);
  if (error) return { error, user: null };
  if (user.role !== 'admin') {
    return { error: 'Forbidden - Admin access required', user: null };
  }
  return { error: null, user };
}
