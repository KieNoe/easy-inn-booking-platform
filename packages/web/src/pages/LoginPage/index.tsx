import React, { useState } from 'react';
import md5 from 'md5';
import api from '@/utils/api';
import { Form, Input, Button, Card, Checkbox, message, Result, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import './index.css';

type AuthState = 'login' | 'register' | 'forgotPassword' | 'resetPassword' | 'success';

const HomePage: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/user/login', {
        username: form.getFieldValue('username'),
        password: md5(form.getFieldValue('password')),
      });
      localStorage.setItem('auth_token', response.data.token);
      message.success('登录成功');
      setAuthState('success');
    } catch (error) {
      message.error('登录失败');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const response = await api.post('/api/user/register', {
        username: values.username,
        email: values.email,
        password: md5(values.password),
        role: values.role,
      });
      localStorage.setItem('auth_token', response.data.token);
      message.success(response.data.message || '注册成功');
      setAuthState('success');
    } catch (error) {
      message.error('注册失败');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await api.post('/api/user/forgot-password/send-code', {
        email: values.email,
        code: values.code,
      });
      setAuthState('resetPassword');
    } catch (error) {
      message.error('验证失败');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    try {
      const email = form.getFieldValue('email');
      if (!email) {
        message.error('请先输入邮箱');
        return;
      }
      setLoading(true);
      const response = await api.post('/api/user/forgot-password/send-code', { email });
      message.success(response.data.message || '验证码已发送');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      message.error('发送验证码失败');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await api.post('/api/user/reset-password', {
        email: form.getFieldValue('email'),
        code: form.getFieldValue('code'),
        newPassword: values.newPassword,
      });
      message.success('密码已重置');
      setAuthState('login');
      form.resetFields();
    } catch (error) {
      message.error('重置密码失败');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <Form
      form={form}
      name="login"
      initialValues={{ remember: true }}
      onFinish={handleLogin}
      autoComplete="off"
      size="large"
    >
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input prefix={<UserOutlined />} placeholder="用户名" />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Button type="link" onClick={() => setAuthState('forgotPassword')}>
            忘记密码?
          </Button>
        </div>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          登录
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center' }}>
        <span>还没有账号? </span>
        <Button type="link" onClick={() => setAuthState('register')}>
          立即注册
        </Button>
      </div>
    </Form>
  );

  const renderRegisterForm = () => (
    <Form form={form} name="register" onFinish={handleRegister} autoComplete="off" size="large">
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input prefix={<UserOutlined />} placeholder="用户名" />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="邮箱" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6位' },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: '请确认密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
      </Form.Item>

      <Form.Item name="role" rules={[{ required: true, message: '请选择角色' }]}>
        <Select
          placeholder="请选择角色"
          options={[
            { label: '商户', value: 'merchant' },
            { label: '管理员', value: 'admin' },
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          注册
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center' }}>
        <span>已有账号? </span>
        <Button type="link" onClick={() => setAuthState('login')}>
          立即登录
        </Button>
      </div>
    </Form>
  );

  const renderForgotPasswordForm = () => (
    <Form form={form} name="forgotPassword" onFinish={handleForgotPassword} autoComplete="off" size="large">
      <Form.Item
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="请输入注册邮箱" />
      </Form.Item>

      <Form.Item name="code" rules={[{ required: true, message: '请输入验证码' }]}>
        <Input
          placeholder="请输入验证码"
          prefix={<SafetyOutlined />}
          suffix={
            <Button
              type="link"
              onClick={handleSendCode}
              disabled={countdown > 0 || loading}
              style={{ padding: '0' }}
              loading={loading}
            >
              {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
            </Button>
          }
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          下一步
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => setAuthState('login')}>
          返回登录
        </Button>
      </div>
    </Form>
  );

  const renderResetPasswordForm = () => (
    <Form form={form} name="resetPassword" onFinish={handleResetPassword} autoComplete="off" size="large">
      <Form.Item
        name="newPassword"
        rules={[
          { required: true, message: '请输入新密码' },
          { min: 6, message: '密码至少6位' },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="请输入新密码" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: '请确认新密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="请确认新密码" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          重置密码
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => setAuthState('login')}>
          返回登录
        </Button>
      </div>
    </Form>
  );

  const renderSuccess = () => (
    <Result
      status="success"
      title={authState === 'login' ? '登录成功' : '注册成功'}
      subTitle="即将跳转到首页..."
      extra={
        <Button type="primary" onClick={() => setAuthState('login')}>
          立即跳转
        </Button>
      }
    />
  );

  const renderContent = () => {
    switch (authState) {
      case 'login':
        return renderLoginForm();
      case 'register':
        return renderRegisterForm();
      case 'forgotPassword':
        return renderForgotPasswordForm();
      case 'resetPassword':
        return renderResetPasswordForm();
      case 'success':
        return renderSuccess();
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (authState) {
      case 'login':
        return '登录';
      case 'register':
        return '注册';
      case 'forgotPassword':
        return '找回密码';
      case 'resetPassword':
        return '重置密码';
      default:
        return '';
    }
  };

  return (
    <div className="login-page-container">
      <Card className="login-card" title={getTitle()} bordered={false}>
        {renderContent()}
      </Card>
    </div>
  );
};

export default HomePage;
