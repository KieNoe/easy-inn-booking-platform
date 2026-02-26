import { Request, Response } from 'express';
import UserService from '@services/UserService';
import { successResponse, errors } from '@utils/response';

export class UserController {
  /**
   * 用户登录
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        errors.badRequest(res, '请求参数缺失');
        return;
      }

      const result = await UserService.login({ username, password });
      successResponse(res, result, '登录成功');
    } catch (error: any) {
      if (error.message === '用户名或密码错误') {
        errors.badRequest(res, error.message);
      } else {
        errors.serverError(res, error.message);
      }
    }
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        errors.unauthorized(res);
        return;
      }

      const userInfo = await UserService.getUserInfo(req.user.userId);
      successResponse(res, userInfo, '获取成功');
    } catch (error: any) {
      if (error.message === '用户不存在') {
        errors.notFound(res, error.message);
      } else {
        errors.serverError(res, error.message);
      }
    }
  }

  /**
   * 用户注册
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, email, role } = req.body;

      if (!username || !password || !email) {
        errors.badRequest(res, '请求参数缺失');
        return;
      }

      const result = await UserService.register({
        username,
        password,
        email,
        role,
      });

      successResponse(res, result, '注册成功');
    } catch (error: any) {
      if (error.message === '用户名已存在' || error.message === '邮箱已被注册' || error.message === '请求参数缺失') {
        errors.badRequest(res, error.message);
      } else {
        errors.serverError(res, error.message);
      }
    }
  }

  /**
   * 退出登录
   */
  logout(_req: Request, res: Response): void {
    // 简单的退出登录实现（实际应用可能需要token黑名单）
    successResponse(res, null, '退出登录成功');
  }

  /**
   * 发送找回密码验证码
   */
  async sendVerificationCode(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        errors.badRequest(res, '请求参数缺失');
        return;
      }

      const result = await UserService.sendVerificationCode({ email });
      successResponse(res, result, '验证码已发送至邮箱');
    } catch (error: any) {
      if (error.message === '该邮箱未注册') {
        errors.badRequest(res, error.message);
      } else {
        errors.serverError(res, error.message);
      }
    }
  }

  /**
   * 验证找回密码验证码
   */
  async verifyCode(req: Request, res: Response): Promise<void> {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        errors.badRequest(res, '请求参数缺失');
        return;
      }

      const result = await UserService.verifyCode({ email, code });
      successResponse(res, result, '验证码验证成功');
    } catch (error: any) {
      if (error.message === '验证码错误或已过期') {
        errors.badRequest(res, error.message);
      } else {
        errors.serverError(res, error.message);
      }
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, code, password } = req.body;

      if (!email || !code || !password) {
        errors.badRequest(res, '请求参数缺失');
        return;
      }

      await UserService.resetPassword({ email, code, password });
      successResponse(res, null, '密码重置成功');
    } catch (error: any) {
      if (error.message === '验证码错误或已过期' || error.message === '该邮箱未注册') {
        errors.badRequest(res, error.message);
      } else {
        errors.serverError(res, error.message);
      }
    }
  }
}

export default new UserController();
