import User from '@models/User';
import { hashPassword, verifyPassword, generateToken, md5 } from '@utils/auth';
import type { User as UserType, LoginRequest, RegisterRequest, RegisterResponse } from '../types';

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

    // 兼容前端 MD5 传参：未加密则先做 MD5 再比较
    const inputPassword = /^[a-f0-9]{32}$/i.test(credentials.password)
      ? credentials.password
      : md5(credentials.password);
    const isValidPassword = await verifyPassword(inputPassword, user.password);
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
  async register(data: RegisterRequest): Promise<RegisterResponse> {
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

    const normalizedPassword = /^[a-f0-9]{32}$/i.test(data.password) ? data.password : md5(data.password);
    const hashedPassword = await hashPassword(normalizedPassword);

    const normalizedRole = data.role && ['admin', 'super_admin'].includes(data.role) ? 'user' : 'user';

    const user = await User.create({
      username: data.username,
      password: hashedPassword,
      nickname: data.nickname || data.username,
      email: data.email,
      phone: data.phone,
      role: normalizedRole,
      status: 'active',
    } as any);

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
      expireTime: 7200,
    };
  }
}

export default new UserService();
