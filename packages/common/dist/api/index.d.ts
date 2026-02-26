import { AxiosInstance, AxiosRequestConfig } from 'axios';
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
    success: boolean;
}
export interface ApiError {
    code: number;
    message: string;
    details?: any;
}
declare class ApiClient {
    private instance;
    constructor(baseURL: string, timeout?: number);
    private setupInterceptors;
    private getToken;
    private handleUnauthorized;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    getInstance(): AxiosInstance;
}
declare const createApiClient: (baseURL: string, timeout?: number) => ApiClient;
export { ApiClient, createApiClient };
export default createApiClient;
