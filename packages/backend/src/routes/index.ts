import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// API 路由
router.use('/user', userRoutes);

export default router;
