# 易宿酒店预订平台

智慧出行酒店预订平台是一个面向现代旅游出行场景的综合服务体系，旨在为酒店商家与终端消费者之间搭建高效、便捷的信息交互桥梁。本项目分为两部分，分别是商户端的管理酒店信息平台和用户端的酒店预定流程页面。通过差异化的产品设计满足不同用户群体的核心诉求。商户端平台专注于酒店信息管理与运营协作，为酒店商家提供专业化的信息录入、审核流程及发布管理能力；用户端平台则聚焦于用户体验优化，通过简洁直观的交互流程帮助用户快速找到符合需求的优质酒店。

## 项目结构

```
easy-inn-booking-platform/
├── packages/
│   ├── web/          # 商户端 Web 应用
│   ├── mobile/       # 用户端小程序应用
│   ├── backend/      # 后端服务
│   └── common/       # 公共代码库
├── docs/             # 项目文档
└── package.json      # Monorepo 根配置
```

## 技术栈

### 商户端 (Web)

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 4
- **UI 组件库**: Ant Design 6
- **状态管理**: Redux Toolkit
- **路由**: React Router 6
- **HTTP 客户端**: Axios

### 用户端 (Mobile)

- **框架**: Taro 4 + React + TypeScript
- **UI 组件库**: Taro UI
- **支持平台**: 微信小程序、支付宝小程序、H5、QQ 小程序等多端

### 后端 (Backend)

- **运行时**: Node.js
- **框架**: Express + TypeScript
- **数据库**: MySQL
- **ORM**: Sequelize
- **认证**: JWT + bcryptjs
- **其他**: Joi (参数校验)、Nodemailer (邮件服务)

### 公共库 (Common)

- 共享类型定义和工具函数

## 功能模块

### 商户端 (Web)

| 模块     | 功能描述           |
| -------- | ------------------ |
| 登录页面 | 商户登录认证       |
| 酒店管理 | 酒店列表查看与管理 |
| 酒店编辑 | 酒店信息的增删改查 |

### 用户端 (Mobile)

| 模块     | 功能描述         |
| -------- | ---------------- |
| 首页     | 酒店推荐展示     |
| 酒店列表 | 酒店浏览与筛选   |
| 酒店详情 | 酒店详细信息查看 |
| 搜索     | 酒店搜索功能     |

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- MySQL >= 5.7

### 安装依赖

```bash
pnpm install
```

### 启动开发服务

```bash
# 启动 Web 端
pnpm dev:web

# 启动移动端（微信小程序）
pnpm dev:mobile

# 启动后端服务
cd packages/backend && pnpm dev
```

### 构建生产版本

```bash
# 构建 Web 端
pnpm build:web

# 构建移动端
pnpm build:mobile
```

## 开发规范

### 代码风格

项目使用 ESLint + Prettier 进行代码规范管理：

```bash
# 代码检查
pnpm lint

# 自动修复
pnpm lint:fix

# 代码格式化
pnpm format
```

### Git 提交规范

项目使用 Commitizen + Commitlint 进行提交信息规范管理：

```bash
# 交互式提交
pnpm commit
```

提交类型：

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具变动

## 文档

更多详细文档请查看 [docs](./docs) 目录：

- [后端服务启动指南](./docs/后端服务启动指南.md)
- [后端架构设计](./docs/后端架构设计.md)
- [后端接口设计](./docs/后端接口设计.md)
- [接口文档](./docs/接口文档.md)

## 许可证

[MIT](./LICENSE)
