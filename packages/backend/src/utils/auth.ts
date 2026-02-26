import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import type { JwtPayload } from '../types';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '2h';

/**
 * MD5 加密（与前端一致）
 */
export const md5 = (str: string): string => {
  return crypto.createHash('md5').update(str).digest('hex');
};

/**
 * Bcrypt 加密密码
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

/**
 * 验证密码
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(password, hash);
};

/**
 * 生成 JWT Token
 */
export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: '2h' };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * 验证 JWT Token
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

/**
 * 从 Authorization header 提取 token
 */
export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
