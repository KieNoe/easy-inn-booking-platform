import { Request, Response, NextFunction } from 'express';
import { extractToken, verifyToken } from '@utils/auth';
import { errors } from '@utils/response';
import { JwtPayload } from '@types/index';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * JWT 认证中间件
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    errors.unauthorized(res, 'token 无效/过期，需重新登录');
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    errors.unauthorized(res, 'token 已过期，请重新登录');
    return;
  }

  req.user = payload;
  next();
};

/**
 * 错误处理中间件
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  if (err.message === 'Validation failed') {
    errors.badRequest(res, err.details?.[0]?.message || '参数校验失败');
    return;
  }

  errors.serverError(res, '服务器内部错误');
};
