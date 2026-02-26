-- 创建数据库
CREATE DATABASE IF NOT EXISTS easy_inn_booking;
USE easy_inn_booking;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  userId INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名/手机号',
  password VARCHAR(255) NOT NULL COMMENT '加密后的密码',
  nickname VARCHAR(100) COMMENT '昵称',
  email VARCHAR(100) COMMENT '邮箱',
  phone VARCHAR(20) COMMENT '手机号',
  avatar VARCHAR(255) COMMENT '头像URL',
  role ENUM('super_admin', 'admin', 'user') DEFAULT 'user' COMMENT '角色',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '账户状态',
  createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 初始管理员账户（密码：123456 的 MD5 再 bcrypt 加密值）
-- 实际部署时请修改密码
INSERT INTO users (username, password, nickname, role, status) VALUES
('admin', '$2a$10$vFzppBQb3gbH7KsHSIe1tuKzshMs1AX2mfZ7DGmqtIX6z.k9Ex7gu', '管理员', 'super_admin', 'active')
ON DUPLICATE KEY UPDATE username=username;
