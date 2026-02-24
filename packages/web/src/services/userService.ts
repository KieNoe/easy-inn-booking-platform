import md5 from 'md5';
import { ApiResponse, LoginRequest, LoginData, RegisterRequest, RegisterData, User } from '@/types/user';

// 登录函数（使用Mock数据）
export const login = async (username: string, password: string): Promise<ApiResponse<LoginData>> => {
  // const response = await api.post<ApiResponse<LoginData>>('/api/user/login', {
  //   username,
  //   password: md5(password),
  // });
  // return response;
  
  console.log('login', username, password);
  return {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT Token
      "userInfo": {
        "userId": 1001,
        "username": username,
        "role": "admin",
        "avatar": "https://xxx.com/avatar/admin.jpg"
      },
      "expireTime": 7200 // token 有效期（秒）
    }
  };
};

// 注册函数（使用Mock数据）
export const register = async (data: RegisterRequest): Promise<ApiResponse<RegisterData>> => {
  console.log('register', data);
  return {
    "code": 200,
    "message": "注册成功",
    "data": {
      "userId": 1002,
      "username": data.username,
      "email": data.email,
      "role": data.role || "user",
      "createTime": new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
  };
};

// 获取用户信息函数（使用Mock数据）
export const getUserInfo = async (): Promise<ApiResponse<User>> => {
  console.log('getUserInfo');
  return {
    "code": 200,
    "message": "获取成功",
    "data": {
      "userId": 1001,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "avatar": "https://xxx.com/avatar/admin.jpg",
      "status": "active",
      "createTime": "2026-02-05 10:00:00"
    }
  };
};

// 退出登录函数（使用Mock数据）
export const logout = async (): Promise<ApiResponse<null>> => {
  console.log('logout');
  return {
    "code": 200,
    "message": "退出登录成功",
    "data": null
  };
};