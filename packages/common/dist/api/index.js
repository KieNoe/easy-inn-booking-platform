"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiClient = exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ApiClient {
    constructor(baseURL, timeout = 10000) {
        this.instance = axios_1.default.create({
            baseURL,
            timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use((config) => {
            // 添加认证token
            const token = this.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            // 添加请求时间戳
            config.headers['X-Request-Timestamp'] = Date.now();
            console.log(`🚀 发送请求: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            console.error('❌ 请求拦截器错误:', error);
            return Promise.reject(error);
        });
        // 响应拦截器
        this.instance.interceptors.response.use((response) => {
            console.log(`✅ 请求成功: ${response.config.url}`, response.data);
            return response.data;
        }, (error) => {
            console.error('❌ 请求失败:', error.response?.data || error.message);
            // 统一错误处理
            const apiError = {
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
        });
    }
    getToken() {
        // 从localStorage或cookie获取token
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        }
        return null;
    }
    handleUnauthorized() {
        // 清除token并跳转到登录页
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_token');
            // 这里可以添加跳转到登录页的逻辑
            window.location.href = '/login';
        }
    }
    // 公共请求方法
    async get(url, config) {
        return this.instance.get(url, config);
    }
    async post(url, data, config) {
        return this.instance.post(url, data, config);
    }
    async put(url, data, config) {
        return this.instance.put(url, data, config);
    }
    async delete(url, config) {
        return this.instance.delete(url, config);
    }
    async patch(url, data, config) {
        return this.instance.patch(url, data, config);
    }
    // 获取原始的axios实例（用于特殊需求）
    getInstance() {
        return this.instance;
    }
}
exports.ApiClient = ApiClient;
// 创建默认的API客户端实例
const createApiClient = (baseURL, timeout) => {
    return new ApiClient(baseURL, timeout);
};
exports.createApiClient = createApiClient;
exports.default = createApiClient;
