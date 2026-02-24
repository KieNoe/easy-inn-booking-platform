// import api from '@/utils/api';
// import md5 from 'md5';
import { ApiResponse, LoginData, RegisterData } from '@/types/login';

// 登录
export const login = async (username: string, password: string): Promise<ApiResponse<LoginData>> => {
  //   const response = await api.post<ApiResponse<LoginData>>('/api/user/login', {
  //     username,
  //     password: md5(password),
  //   });
  //   return response;
  console.log('login', username, password);
  if (username === 'admin') {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // JWT Token
        userInfo: {
          userId: 1001,
          username: username,
          role: 'admin',
          avatar: 'https://xxx.com/avatar/admin.jpg',
        },
        expireTime: 7200, // token 有效期（秒）
      },
    };
  } else {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // JWT Token
        userInfo: {
          userId: 1001,
          username: username,
          role: 'merchant',
          avatar: 'https://xxx.com/avatar/merchant.jpg',
        },
        expireTime: 7200, // token 有效期（秒）
      },
    };
  }
};

// 注册
export const register = async (
  username: string,
  email: string,
  password: string,
  role: string,
): Promise<ApiResponse<RegisterData>> => {
  // const response = await api.post<ApiResponse<RegisterData>>('/api/user/register', {
  //     username,
  //     email,
  //     password: md5(password),
  //     role,
  // });
  // return response;
  console.log('register', username, email, password, role);
  return {
    code: 200,
    message: '获取成功',
    data: {
      userId: 1001,
      username: username,
      email: email,
      role: role, // 角色：admin=管理员，merchant=商户
      createTime: '2023-01-01 10:00:00',
    },
  };
};

// 发送找回密码验证码
export const sendForgotPasswordCode = async (
  email: string,
): Promise<ApiResponse<{ email: string; expireTime: number }>> => {
  // const response = await api.post<ApiResponse<{ email: string; expireTime: number }>>(
  //     '/api/user/forgot-password/send-code',
  //     { email }
  // );
  // return response;
  console.log('sendForgotPasswordCode', email);
  return {
    code: 200,
    message: '发送成功',
    data: {
      email: email,
      expireTime: 600,
    },
  };
};
// 验证找回密码验证码
export const verifyForgotPasswordCode = async (email: string, code: string): Promise<ApiResponse<null>> => {
  // const response = await api.post<ApiResponse<null>>('/api/user/forgot-password/verify-code', {
  //     email,
  //     code,
  // });
  // return response;
  console.log('verifyForgotPasswordCode', email, code);
  return {
    code: 200,
    message: '验证成功',
    data: null,
  };
};

// 重置密码
export const resetPassword = async (email: string, code: string, newPassword: string): Promise<ApiResponse<null>> => {
  // const response = await api.post<ApiResponse<null>>('/api/user/reset-password', {
  //     email,
  //     code,
  //     password: md5(newPassword),
  // });
  // return response;
  console.log('resetPassword', email, code, newPassword);
  return {
    code: 200,
    message: '重置成功',
    data: null,
  };
};
