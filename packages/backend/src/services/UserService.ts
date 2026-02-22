const nodemailer = require('nodemailer');
import User from '@models/User';
import { hashPassword, verifyPassword, generateToken, md5 } from '@utils/auth';
import type {
  User as UserType,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  SendCodeRequest,
  SendCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
} from '../types';

// 验证码存储（生产环境应使用 Redis）
interface VerificationCode {
  code: string;
  expireTime: number;
  verified?: boolean;
  verifiedExpireTime?: number;
}

const verificationCodes = new Map<string, VerificationCode>();

// 生成随机验证码
function generateRandomCode(length: number = 6): string {
  return Math.random()
    .toString()
    .slice(2, 2 + length);
}

const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com', // QQ邮箱SMTP服务器
  port: 465, // SSL端口
  secure: true, // 使用SSL
  auth: {
    user: '3388155024@qq.com', // 你的QQ邮箱
    pass: 'ytqttebhhcjwchcg', // 授权码
  },
});

async function sendEmail(to: string, subject: string, content: string) {
  try {
    const info = await transporter.sendMail({
      from: '"发件人名称" <3388155024@qq.com>', // 发件人
      to: to, // 收件人
      subject: subject, // 主题
      html: content, // HTML内容
    });

    console.log('邮件发送成功:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('邮件发送失败:', error);
    return { success: false, error: error.message };
  }
}

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
   * 注册用户
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    // 检查数据库是否启用
    if (process.env.DB_ENABLED !== 'true') {
      throw new Error('数据库未启用，无法执行此操作');
    }

    // 检查必填参数
    if (!data.username || !data.email || !data.password) {
      throw new Error('请求参数缺失');
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({
      where: { username: data.username },
    } as any);

    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({
      where: { email: data.email },
    } as any);

    if (existingEmail) {
      throw new Error('邮箱已被注册');
    }

    const normalizedPassword = /^[a-f0-9]{32}$/i.test(data.password) ? data.password : md5(data.password);
    const hashedPassword = await hashPassword(normalizedPassword);

    const normalizedRole = data.role && ['merchant', 'admin'].includes(data.role) ? data.role : 'merchant';

    const user = await User.create({
      username: data.username,
      password: hashedPassword,
      nickname: data.nickname || data.username,
      email: data.email,
      phone: data.phone,
      role: normalizedRole,
      status: 'active',
    } as any);

    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
      createTime: user.createTime,
    };
  }

  /**
   * 发送找回密码验证码
   */
  async sendVerificationCode(data: SendCodeRequest): Promise<SendCodeResponse> {
    // 检查数据库是否启用
    if (process.env.DB_ENABLED !== 'true') {
      throw new Error('数据库未启用，无法执行此操作');
    }

    // 检查邮箱是否已注册
    const user = await User.findOne({
      where: { email: data.email },
    } as any);

    if (!user) {
      throw new Error('该邮箱未注册');
    }

    // 生成验证码
    const code = generateRandomCode(6);
    const expireTime = 300; // 5分钟

    // 存储验证码（生产环境应使用 Redis 并发送邮件）
    verificationCodes.set(data.email, {
      code,
      expireTime: Date.now() + expireTime * 1000,
    });

    // TODO: 实际发送邮件
    sendEmail(data.email, '密码找回验证码', `<h1>密码找回</h1><p>您的验证码是: ${code}</p><p>验证码有效期5分钟</p>`);

    return {
      email: data.email,
      expireTime,
    };
  }

  /**
   * 验证找回密码验证码
   */
  async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const stored = verificationCodes.get(data.email);

    if (!stored) {
      throw new Error('验证码错误或已过期');
    }

    if (stored.code !== data.code || Date.now() > stored.expireTime) {
      throw new Error('验证码错误或已过期');
    }

    // 标记为已验证，设置重置密码的有效期（2分钟）
    stored.verified = true;
    stored.verifiedExpireTime = Date.now() + 120 * 1000;

    return {
      verified: true,
      expireTime: 120, // 验证通过后的有效期（秒）
    };
  }

  /**
   * 重置密码
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    // 检查数据库是否启用
    if (process.env.DB_ENABLED !== 'true') {
      throw new Error('数据库未启用，无法执行此操作');
    }

    // 验证验证码
    const stored = verificationCodes.get(data.email);

    if (!stored || !stored.verified || Date.now() > (stored.verifiedExpireTime || 0)) {
      throw new Error('验证码错误或已过期');
    }

    // 检查用户是否存在
    const user = await User.findOne({
      where: { email: data.email },
    } as any);

    if (!user) {
      throw new Error('该邮箱未注册');
    }

    // 更新密码
    const normalizedPassword = /^[a-f0-9]{32}$/i.test(data.password) ? data.password : md5(data.password);
    const hashedPassword = await hashPassword(normalizedPassword);

    await user.update({ password: hashedPassword });

    // 清除验证码
    verificationCodes.delete(data.email);
  }
}

export default new UserService();
