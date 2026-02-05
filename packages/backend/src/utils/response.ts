import { Response } from 'express';
import type { ApiResponse } from '../types';

/**
 * 成功响应
 */
export const successResponse = <T>(
  res: Response,
  data: T,
  message = '操作成功',
  code = 200
): Response => {
  return res.status(code).json({
    code,
    message,
    data,
  } as ApiResponse<T>);
};

/**
 * 错误响应
 */
export const errorResponse = (
  res: Response,
  code: number,
  message: string,
  statusCode = 400
): Response => {
  return res.status(statusCode).json({
    code,
    message,
    data: null,
  } as ApiResponse);
};

/**
 * 常见错误响应快捷方法
 */
export const errors = {
  badRequest: (res: Response, message = '请求参数错误') => errorResponse(res, 400, message, 400),
  unauthorized: (res: Response, message = 'token 已过期，请重新登录') => errorResponse(res, 401, message, 401),
  forbidden: (res: Response, message = '权限不足') => errorResponse(res, 403, message, 403),
  notFound: (res: Response, message = '资源不存在') => errorResponse(res, 404, message, 404),
  serverError: (res: Response, message = '服务器内部错误') => errorResponse(res, 500, message, 500),
};
