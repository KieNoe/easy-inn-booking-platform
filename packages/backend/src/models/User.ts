import { DataTypes, Model, Sequelize } from 'sequelize';
import type { UserModel } from '../types';

class User extends Model<UserModel> implements UserModel {
  declare userId: number;
  declare username: string;
  declare password: string;
  declare nickname: string;
  declare email: string;
  declare phone: string;
  declare avatar: string;
  declare role: 'merchant' | 'admin';
  declare status: 'active' | 'inactive';
  declare createTime: string;
  declare readonly updatedAt: Date;
}

/**
 * 初始化 User 模型
 * 这个函数在数据库连接后调用
 */
export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(100),
      },
      email: {
        type: DataTypes.STRING(100),
      },
      phone: {
        type: DataTypes.STRING(20),
      },
      avatar: {
        type: DataTypes.STRING(255),
      },
      role: {
        type: DataTypes.ENUM('merchant', 'admin'),
        defaultValue: 'merchant',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      createTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'createTime',
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false,
      underscored: false,
    },
  );

  return User;
};

export default User;
