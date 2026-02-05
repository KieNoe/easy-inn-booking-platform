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
  role: 'super_admin' | 'admin' | 'user';
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
