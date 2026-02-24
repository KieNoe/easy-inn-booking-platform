// 用户相关类型定义

// API响应数据格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 登录请求参数
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应数据
export interface LoginData {
  token: string;
  userInfo: {
    userId: number;
    username: string;
    role: string;
    avatar: string;
  };
  expireTime: number;
}

// 注册请求参数
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

// 注册响应数据
export interface RegisterData {
  userId: number;
  username: string;
  email: string;
  role: string;
  createTime: string;
}

// 用户信息
export interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
  avatar: string;
  status: string;
  createTime: string;
}

// 更新用户状态请求参数
export interface UpdateUserStatusRequest {
  status: string;
}