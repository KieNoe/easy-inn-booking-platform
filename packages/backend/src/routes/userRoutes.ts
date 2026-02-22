import { Router } from 'express';
import UserController from '@controllers/UserController';
import { authMiddleware } from '@middleware/auth';

const router: Router = Router();

/**
 * 用户认证路由
 */

// 登录（无需认证）
router.post('/login', (req, res) => UserController.login(req, res));

// 注册（无需认证）
router.post('/register', (req, res) => UserController.register(req, res));

// 获取用户信息（需要认证）
router.get('/info', authMiddleware, (req, res) => UserController.getUserInfo(req, res));

// 退出登录（需要认证）
router.post('/logout', authMiddleware, (req, res) => UserController.logout(req, res));

// 发送找回密码验证码（无需认证）
router.post('/forgot-password/send-code', (req, res) => UserController.sendVerificationCode(req, res));

// 验证找回密码验证码（无需认证）
router.post('/forgot-password/verify-code', (req, res) => UserController.verifyCode(req, res));

// 重置密码（无需认证）
router.post('/reset-password', (req, res) => UserController.resetPassword(req, res));

export default router;
