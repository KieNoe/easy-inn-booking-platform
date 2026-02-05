import { createApiClient } from 'common';

const env = import.meta.env;

// 创建API客户端实例
const apiClient = createApiClient(
  env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  15000 // 15秒超时
);

// 导出常用的请求方法
export const api = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
  patch: apiClient.patch.bind(apiClient),
};

// 导出原始的API客户端实例（用于特殊需求）
export { apiClient };

export default api;