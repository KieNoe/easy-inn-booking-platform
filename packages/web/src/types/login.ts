export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

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

export interface RegisterData {
  userId: number;
  username: string;
  email: string;
  role: string;
  createTime: string;
}