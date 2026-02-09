import * as common from 'common';

const env = import.meta.env;

// 创建API客户端实例
const apiClient = common.createApiClient(
  env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  15000, // 15秒超时
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

// import api from '@/utils/api';
// // GET 请求
// const data = await api.get('/user/profile');
// // POST 请求
// const result = await api.post('/auth/login', { username: 'admin', password: '123456' });
// // PUT 请求
// const updated = await api.put('/user/profile', { nickname: '新昵称' });
// // DELETE 请求
// await api.delete('/user/123');
// // PATCH 请求
// const patched = await api.patch('/user/123', { field: 'value' });
