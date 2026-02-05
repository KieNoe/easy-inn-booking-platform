import User from '@models/User';
import { hashPassword, verifyPassword, generateToken } from '@utils/auth';
import type { User as UserType, LoginRequest, LoginResponse } from '../types';

export class UserService {
  /**
   * 用户登录
   */
  async login(credentials: LoginRequest): Promise<{ token: string; userInfo: UserType; expireTime: number }> {
    // 检查数据库是否启用
    if (process.env.DB_ENABLED !== 'true') {
      throw new Error('数据库未启用，无法执行此操作');
    }

    const user = await User.findOne({
      where: { username: credentials.username },
    } as any);

    if (!user) {
      throw new Error('用户名或密码错误');
    }

    // 比较密码（前端已MD5加密，后端也应该使用MD5比较）
    const isValidPassword = await verifyPassword(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('用户名或密码错误');
    }

    // 生成 token
    const token = generateToken({
      userId: user.userId,
      username: user.username,
      role: user.role,
    });

    return {
      token,
      userInfo: {
        userId: user.userId,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        createTime: user.createTime,
      },
      expireTime: 7200, // 2小时
    };
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(userId: number): Promise<UserType> {
    // 检查数据库是否启用
    if (process.env.DB_ENABLED !== 'true') {
      throw new Error('数据库未启用，无法执行此操作');
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('用户不存在');
    }

    return {
      userId: user.userId,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      createTime: user.createTime,
    };
  }

  /**
   * 注册用户（可选功能，接口文档中未提及）
   */
  async register(data: {
    username: string;
    password: string;
    nickname?: string;
    email?: string;
    phone?: string;
  }): Promise<UserType> {
    // 检查数据库是否启用
    if (process.env.DB_ENABLED !== 'true') {
      throw new Error('数据库未启用，无法执行此操作');
    }

    const existingUser = await User.findOne({
      where: { username: data.username },
    } as any);

    if (existingUser) {
      throw new Error('用户名已存在');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await User.create({
      username: data.username,
      password: hashedPassword,
      nickname: data.nickname || data.username,
      email: data.email,
      phone: data.phone,
      role: 'user',
      status: 'active',
    } as any);

    return {
      userId: user.userId,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      createTime: user.createTime,
    };
  }
}

export default new UserService();
