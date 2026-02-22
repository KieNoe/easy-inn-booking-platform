/**
 * API 统一响应格式
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

/**
 * 用户相关类型
 */
export interface User {
  userId: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'merchant' | 'admin' ;
  status: 'active' | 'inactive';
  createTime: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userInfo: Omit<User, 'createTime'>;
  expireTime: number;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface RegisterResponse {
  userId: number;
  username: string;
  email: string;
  role: string;
  createTime: string;
}

/**
 * 找回密码相关类型
 */
export interface SendCodeRequest {
  email: string;
}

export interface SendCodeResponse {
  email: string;
  expireTime: number;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  verified: boolean;
  expireTime: number;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
}

/**
 * JWT Payload
 */
export interface JwtPayload {
  userId: number;
  username: string;
  role: string;
}

/**
 * 数据库模型类型
 */
export interface UserModel extends User {
  password: string;
}
