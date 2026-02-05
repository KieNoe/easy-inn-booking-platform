import { Sequelize } from 'sequelize';

/**
 * 数据库配置
 * 注：此配置为待部署状态，实际使用前需确保 MySQL 数据库已部署
 * 
 * 必需环境变量（部署时设置）:
 * - DB_HOST: 数据库主机地址
 * - DB_PORT: 数据库端口
 * - DB_NAME: 数据库名称
 * - DB_USER: 数据库用户名
 * - DB_PASSWORD: 数据库密码
 */

// 数据库配置对象
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'easy_inn_booking',
  dialect: 'mysql' as const,
};

// 延迟初始化 Sequelize，允许在数据库实际可用时才连接
let sequelize: Sequelize | null = null;

export const getDatabase = (): Sequelize => {
  if (!sequelize) {
    sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: process.env.NODE_ENV === 'production' ? false : console.log,
      }
    );
  }
  return sequelize;
};

export default dbConfig;
