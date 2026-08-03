import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findMockUserByEmail } from './mock-data';

const JWT_SECRET = process.env.JWT_SECRET || 'maison-luxe-super-secret-key-2026';

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

export async function getUserFromRequest(request: Request) {
  const token = getTokenFromHeader(request.headers.get('Authorization'));
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const { default: prisma } = await import('./prisma');
    if (prisma) {
      const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, createdAt: true } });
      if (user) return user;
    }
  } catch {
    console.log('Prisma unavailable for getUserFromRequest, using mock');
  }

  const mockUser = findMockUserByEmail(payload.email);
  if (!mockUser) return null;
  const { password: _, ...userWithoutPassword } = mockUser;
  return userWithoutPassword;
}

export async function requireAuth(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export async function requireAdmin(request: Request) {
  const user = await requireAuth(request);
  if (user.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return user;
}
