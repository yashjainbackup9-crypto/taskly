import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './db';
import { UserModel, IUser } from './models';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-local-jwt-secret-key-change-in-production';

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
}

export function signToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET || JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: '30d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = process.env.JWT_SECRET || JWT_SECRET;
    return jwt.verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(req: NextRequest): Promise<IUser | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || !payload.sub) {
    return null;
  }

  await connectToDatabase();
  const user = await UserModel.findById(payload.sub);
  return user;
}
