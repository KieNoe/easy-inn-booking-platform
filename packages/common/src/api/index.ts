import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API响应数据格式接口
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 错误处理接口
export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string, timeout: number = 10000) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加认证token
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加请求时间戳
        config.headers['X-Request-Timestamp'] = Date.now();

        console.log(`🚀 发送请求: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ 请求拦截器错误:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ 请求成功: ${response.config.url}`, response.data);
        return response.data;
      },
      (error) => {
        console.error('❌ 请求失败:', error.response?.data || error.message);
        
        // 统一错误处理
        const apiError: ApiError = {
          code: error.response?.status || 500,
          message: error.response?.data?.message || error.message || '网络错误',
          details: error.response?.data,
        };

        // 根据状态码处理不同情况
        switch (error.response?.status) {
          case 401:
            // token失效，跳转到登录页
            this.handleUnauthorized();
            break;
          case 403:
            // 权限不足
            console.warn('权限不足，请联系管理员');
            break;
          case 404:
            console.warn('请求的资源不存在');
            break;
          case 500:
            console.error('服务器内部错误');
            break;
          default:
            console.error('未知错误');
        }

        return Promise.reject(apiError);
      }
    );
  }

  private getToken(): string | null {
    // 从localStorage或cookie获取token
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
    return null;
  }

  private handleUnauthorized(): void {
    // 清除token并跳转到登录页
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      // 这里可以添加跳转到登录页的逻辑
      window.location.href = '/login';
    }
  }

  // 公共请求方法
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  // 获取原始的axios实例（用于特殊需求）
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// 创建默认的API客户端实例
const createApiClient = (baseURL: string, timeout?: number): ApiClient => {
  return new ApiClient(baseURL, timeout);
};

export { ApiClient, createApiClient };
export default createApiClient;