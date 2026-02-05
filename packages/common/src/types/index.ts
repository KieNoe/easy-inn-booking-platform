// 通用类型定义

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应
export interface PaginationResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 通用响应格式
export interface BaseResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 用户信息
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// 酒店信息
export interface HotelInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  price: number;
  images: string[];
  rating: number;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}