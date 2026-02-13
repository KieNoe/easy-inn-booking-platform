import { Router } from 'express';
import UserController from '@controllers/UserController';
import { authMiddleware } from '@middleware/auth';

const router = Router();

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

export default router;
