import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import { getDatabase } from '@config/database';
import routes from '@routes/index';
import { errorHandler } from '@middleware/auth';
import { initUserModel } from '@models/User';

const app: Express = express();
const PORT = process.env.PORT || 8080;
const IS_DB_ENABLED = process.env.DB_ENABLED === 'true';

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 路由
app.use('/api', routes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '服务器正常运行',
    database: IS_DB_ENABLED ? '已连接' : '待部署',
  });
});

// 错误处理
app.use(errorHandler);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    data: null,
  });
});

// 启动服务
async function startServer() {
  try {
    // 如果启用数据库，则尝试连接和同步
    if (IS_DB_ENABLED) {
      console.log('⏳ 正在连接数据库...');
      const sequelize = getDatabase();
      
      // 初始化模型
      initUserModel(sequelize);
      
      await sequelize.authenticate();
      console.log('✓ 数据库连接成功');

      // 同步数据库表
      await sequelize.sync({ alter: false });
      console.log('✓ 数据库表同步成功');
    } else {
      console.log('⚠️  数据库未启用 (设置 DB_ENABLED=true 来启用数据库)');
    }

    app.listen(PORT, () => {
      console.log(`✓ 服务器运行在 http://localhost:${PORT}`);
      console.log(`✓ 健康检查: http://localhost:${PORT}/health`);
      console.log(`✓ API 基础路径: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('⚠️  启动失败:', error);
    console.log('\n💡 解决方案:');
    console.log('1. 检查 MySQL 是否运行');
    console.log('2. 验证 .env 中的数据库配置是否正确');
    console.log('3. 或设置 DB_ENABLED=false 来禁用数据库连接');
    process.exit(1);
  }
}

startServer();

export default app;
