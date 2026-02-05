# 易宿酒店预订平台 - 后端项目

Express.js + TypeScript + MySQL 后端服务

## 快速开始

### 1. 安装依赖

```bash
cd packages/backend
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，填写数据库信息：

```bash
cp .env.example .env
```

### 3. 创建数据库

在 MySQL 中执行 `db/init.sql`：

```sql
mysql -u root -p < db/init.sql
```

或者在 MySQL 客户端中复制粘贴 `db/init.sql` 的内容执行。

### 4. 启动开发服务器

```bash
pnpm dev
```

服务器将运行在 `http://localhost:8080`

健康检查: `http://localhost:8080/health`

## 项目结构

```
src/
├── config/       # 数据库配置
├── controllers/  # 请求处理器（业务逻辑）
├── middleware/   # 中间件（认证、错误处理）
├── models/       # 数据库模型（表结构定义）
├── routes/       # 路由定义
├── services/     # 服务层（数据库操作）
├── types/        # TypeScript 类型定义
├── utils/        # 工具函数（加密、JWT等）
└── app.ts        # 应用主文件
```

## API 接口

所有接口返回统一格式：

```json
{
  "code": 200,
  "message": "成功",
  "data": {}
}
```

### 已实现接口

- `POST /api/user/login` - 用户登录
- `GET /api/user/info` - 获取用户信息（需要 token）
- `POST /api/user/logout` - 退出登录（需要 token）

## 数据库初始账户

- 用户名：`admin`
- 密码：`123456`

## 技术栈

- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: MySQL + Sequelize ORM
- **认证**: JWT
- **密码加密**: bcryptjs

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| PORT | 服务器端口 | 8080 |
| NODE_ENV | 环境 | development |
| DB_HOST | 数据库主机 | localhost |
| DB_PORT | 数据库端口 | 3306 |
| DB_NAME | 数据库名 | easy_inn_booking |
| DB_USER | 数据库用户 | root |
| DB_PASSWORD | 数据库密码 | password |
| JWT_SECRET | JWT 密钥 | your_secret_key |
| JWT_EXPIRES_IN | Token 过期时间 | 2h |
