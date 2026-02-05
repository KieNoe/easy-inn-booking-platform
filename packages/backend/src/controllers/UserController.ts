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
   * 退出登录
   */
  logout(req: Request, res: Response): void {
    // 简单的退出登录实现（实际应用可能需要token黑名单）
    successResponse(res, null, '退出登录成功');
  }
}

export default new UserController();
