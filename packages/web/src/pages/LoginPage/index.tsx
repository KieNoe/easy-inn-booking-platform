import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Checkbox, message, Result, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import {
  login,
  register,
  sendForgotPasswordCode,
  verifyForgotPasswordCode,
  resetPassword,
} from '@/services/userService';
import './index.css';

type AuthState = 'login' | 'register' | 'forgotPassword' | 'resetPassword' | 'success' | 'networkError';

// 埋点工具函数
const trackEvent = (eventName: string, data?: Record<string, any>) => {
  console.log(`[埋点] ${eventName}`, data || {});
};

// 页面标题映射
const PAGE_TITLES: Record<AuthState, string> = {
  login: '登录 - 易宿预订平台',
  register: '注册 - 易宿预订平台',
  forgotPassword: '找回密码 - 易宿预订平台',
  resetPassword: '重置密码 - 易宿预订平台',
  success: '成功 - 易宿预订平台',
  networkError: '网络错误 - 易宿预订平台',
};

const LoginPage: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<any>(null);
  const usernameInputRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 页面访问埋点
    trackEvent('page_view', { page: 'login_page', timestamp: Date.now() });

    // 检测网络状态
    const checkNetworkStatus = () => {
      if (!navigator.onLine) {
        setAuthState('networkError');
      }
    };

    // 网络恢复处理
    const handleOnline = () => {
      trackEvent('network_status_change', { status: 'online' });
      setAuthState('login');
    };

    // 网络断开处理
    const handleOffline = () => {
      trackEvent('network_status_change', { status: 'offline' });
      setAuthState('networkError');
    };

    // 页面加载时检测
    checkNetworkStatus();

    // 监听网络状态变化
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 状态切换埋点 + 更新页面标题 + 自动聚焦
  useEffect(() => {
    trackEvent('auth_state_change', { state: authState });
    document.title = PAGE_TITLES[authState];

    // 自动聚焦到第一个输入框
    setTimeout(() => {
      usernameInputRef.current?.focus();
    }, 100);
  }, [authState]);

  const handleLogin = async () => {
    // 检测网络状态
    if (!navigator.onLine) {
      setAuthState('networkError');
      return;
    }
    // 登录开始埋点
    trackEvent('login_start', { username: form.getFieldValue('username') });
    try {
      setLoading(true);
      const response = await login(form.getFieldValue('username'), form.getFieldValue('password'));
      if (response.code !== 200) {
        // 登录失败埋点
        trackEvent('login_failed', { reason: response.message || '登录失败' });
        message.error(response.message || '登录失败');
        return;
      }
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_info', JSON.stringify(response.data.userInfo));
      // 登录成功埋点
      trackEvent('login_success', {
        username: form.getFieldValue('username'),
        role: response.data.userInfo.role,
      });
      message.success('登录成功');
      setAuthState('success');
      if (response.data.userInfo.role === 'admin') {
        trackEvent('navigate_after_login', { target: '/hotel/hotel-management', role: 'admin' });
        navigate('/hotel/hotel-management');
      } else if (response.data.userInfo.role === 'merchant') {
        trackEvent('navigate_after_login', { target: '/hotel/hotel-edit', role: 'merchant' });
        navigate('/hotel/hotel-edit');
      } else {
        trackEvent('login_no_permission', { role: response.data.userInfo.role });
        message.error('无权限访问');
        return;
      }
    } catch (error) {
      trackEvent('login_error', { error: String(error) });
      message.error('网络错误，请稍后重试');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // 检测网络状态
    if (!navigator.onLine) {
      setAuthState('networkError');
      return;
    }
    // 注册开始埋点
    trackEvent('register_start', { username: form.getFieldValue('username') });
    try {
      setLoading(true);
      const values = await form.validateFields();
      const response = await register(values.username, values.email, values.password, values.role);
      if (response.code !== 200) {
        // 注册失败埋点
        trackEvent('register_failed', { reason: response.message || '注册失败' });
        message.error(response.message || '注册失败');
        return;
      }
      // 注册成功埋点
      trackEvent('register_success', { username: values.username, role: values.role });
      message.success('注册成功，请登录');
      setAuthState('login');
      form.resetFields();
    } catch (error) {
      trackEvent('register_error', { error: String(error) });
      message.error('网络错误，请稍后重试');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    // 检测网络状态
    if (!navigator.onLine) {
      setAuthState('networkError');
      return;
    }
    // 验证验证码埋点
    trackEvent('verify_code_start', { email: form.getFieldValue('email') });
    try {
      setLoading(true);
      const values = await form.validateFields(['email', 'code']);
      if (!values.code) {
        trackEvent('verify_code_failed', { reason: '验证码为空' });
        message.error('请输入验证码');
        return;
      }
      const response = await verifyForgotPasswordCode(form.getFieldValue('email'), form.getFieldValue('code'));
      if (response.code !== 200) {
        trackEvent('verify_code_failed', { reason: response.message || '验证码错误' });
        message.error(response.message || '验证码错误');
        return;
      }
      trackEvent('verify_code_success', { email: form.getFieldValue('email') });
      setAuthState('resetPassword');
    } catch (error) {
      trackEvent('verify_code_error', { error: String(error) });
      message.error('请填写完整信息');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    // 检测网络状态
    if (!navigator.onLine) {
      setAuthState('networkError');
      return;
    }
    try {
      const email = form.getFieldValue('email');
      if (!email) {
        trackEvent('send_code_failed', { reason: '邮箱为空' });
        message.error('请先输入邮箱');
        return;
      }
      // 发送验证码埋点
      trackEvent('send_code_start', { email });
      setLoading(true);
      const response = await sendForgotPasswordCode(email);
      if (response.code !== 200) {
        trackEvent('send_code_failed', { reason: response.message || '发送验证码失败' });
        message.error(response.message || '发送验证码失败');
        return;
      }
      trackEvent('send_code_success', { email });
      message.success(response.message || '验证码已发送');
      setCountdown(60);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      trackEvent('send_code_error', { error: String(error) });
      message.error('网络错误，请稍后重试');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    // 检测网络状态
    if (!navigator.onLine) {
      setAuthState('networkError');
      return;
    }
    // 重置密码埋点
    trackEvent('reset_password_start', { email: form.getFieldValue('email') });
    try {
      setLoading(true);
      const values = await form.validateFields();
      const response = await resetPassword(form.getFieldValue('email'), form.getFieldValue('code'), values.newPassword);
      if (response.code !== 200) {
        trackEvent('reset_password_failed', { reason: response.message || '重置密码失败' });
        message.error(response.message || '重置密码失败');
        return;
      }
      trackEvent('reset_password_success', { email: form.getFieldValue('email') });
      message.success('密码已重置，请登录');
      setAuthState('login');
      form.resetFields();
    } catch (error) {
      trackEvent('reset_password_error', { error: String(error) });
      message.error('网络错误，请稍后重试');
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
      autoComplete="on"
      size="large"
      aria-label="登录表单"
    >
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input
          ref={usernameInputRef}
          prefix={<UserOutlined aria-hidden="true" />}
          placeholder="admin为管理员，merchant为商家"
          autoComplete="username"
          aria-describedby="username-hint"
        />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password
          prefix={<LockOutlined aria-hidden="true" />}
          placeholder="密码不为空即可"
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Button
            type="link"
            onClick={() => {
              trackEvent('click_forgot_password');
              setAuthState('forgotPassword');
            }}
            aria-label="忘记密码"
          >
            忘记密码?
          </Button>
        </div>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading} aria-busy={loading}>
          登录
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center' }}>
        <span>还没有账号? </span>
        <Button
          type="link"
          onClick={() => {
            trackEvent('click_register');
            setAuthState('register');
          }}
          aria-label="立即注册新账号"
        >
          立即注册
        </Button>
      </div>
    </Form>
  );

  const renderRegisterForm = () => (
    <Form form={form} name="register" onFinish={handleRegister} autoComplete="on" size="large" aria-label="注册表单">
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input
          ref={usernameInputRef}
          prefix={<UserOutlined aria-hidden="true" />}
          placeholder="用户名"
          autoComplete="username"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]}
      >
        <Input prefix={<MailOutlined aria-hidden="true" />} placeholder="邮箱" autoComplete="email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6位' },
        ]}
      >
        <Input.Password prefix={<LockOutlined aria-hidden="true" />} placeholder="密码" autoComplete="new-password" />
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
        <Input.Password
          prefix={<LockOutlined aria-hidden="true" />}
          placeholder="确认密码"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item name="role" rules={[{ required: true, message: '请选择角色' }]}>
        <Select
          placeholder="请选择角色"
          options={[
            { label: '商户', value: 'merchant' },
            { label: '管理员', value: 'admin' },
          ]}
          aria-label="选择用户角色"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading} aria-busy={loading}>
          注册
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center' }}>
        <span>已有账号? </span>
        <Button
          type="link"
          onClick={() => {
            trackEvent('click_login_from_register');
            setAuthState('login');
          }}
          aria-label="返回登录页面"
        >
          立即登录
        </Button>
      </div>
    </Form>
  );

  const renderForgotPasswordForm = () => (
    <Form
      form={form}
      name="forgotPassword"
      onFinish={handleForgotPassword}
      autoComplete="on"
      size="large"
      aria-label="找回密码表单"
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]}
      >
        <Input
          ref={usernameInputRef}
          prefix={<MailOutlined aria-hidden="true" />}
          placeholder="请输入注册邮箱"
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item name="code" rules={[{ required: true, message: '请输入验证码' }]}>
        <Input
          placeholder="请输入验证码"
          prefix={<SafetyOutlined aria-hidden="true" />}
          suffix={
            <Button
              type="link"
              onClick={handleSendCode}
              disabled={countdown > 0 || loading}
              style={{ padding: '0' }}
              loading={loading}
              aria-label={countdown > 0 ? `${countdown}秒后可重新发送验证码` : '发送验证码到邮箱'}
            >
              {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
            </Button>
          }
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading} aria-busy={loading}>
          下一步
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center' }}>
        <Button
          type="link"
          onClick={() => {
            trackEvent('click_back_to_login_from_forgot');
            setAuthState('login');
          }}
          aria-label="返回登录页面"
        >
          返回登录
        </Button>
      </div>
    </Form>
  );

  const renderResetPasswordForm = () => (
    <Form
      form={form}
      name="resetPassword"
      onFinish={handleResetPassword}
      autoComplete="on"
      size="large"
      aria-label="重置密码表单"
    >
      <Form.Item
        name="newPassword"
        rules={[
          { required: true, message: '请输入新密码' },
          { min: 6, message: '密码至少6位' },
        ]}
      >
        <Input.Password
          ref={usernameInputRef}
          prefix={<LockOutlined aria-hidden="true" />}
          placeholder="请输入新密码"
          autoComplete="new-password"
        />
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
        <Input.Password
          prefix={<LockOutlined aria-hidden="true" />}
          placeholder="请确认新密码"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading} aria-busy={loading}>
          重置密码
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center' }}>
        <Button
          type="link"
          onClick={() => {
            trackEvent('click_back_to_login_from_reset');
            setAuthState('login');
          }}
          aria-label="返回登录页面"
        >
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
      role="status"
      aria-live="polite"
      extra={
        <Button
          type="primary"
          onClick={() => {
            trackEvent('click_immediate_redirect');
            setAuthState('login');
          }}
        >
          立即跳转
        </Button>
      }
    />
  );

  const renderNetworkError = () => (
    <Result
      status="error"
      title="网络连接失败"
      subTitle="请检查网络连接后重试"
      role="alert"
      aria-live="assertive"
      extra={
        <Button
          type="primary"
          onClick={() => {
            trackEvent('click_reload_page');
            window.location.reload();
          }}
        >
          重新加载页面
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
      case 'networkError':
        return renderNetworkError();
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
      case 'networkError':
        return '网络错误';
      default:
        return '';
    }
  };

  return (
    <div className="login-page-container" role="main">
      <Card className="login-card" title={getTitle()} bordered={false}>
        {renderContent()}
      </Card>
    </div>
  );
};

export default LoginPage;
