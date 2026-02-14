import { api } from '@/utils/api';

export interface CityItem {
  id: number;
  name: string;
  pinyin: string;
  level: number; // 行政级别，如1代表直辖市，2代表省会城市等
  isPopular?: boolean; // 是否热门城市
}

export interface LocationResponse {
  code: number;
  message: string;
  data: {
    cities: CityItem[];
  };
}

export const locationService = {
  // 获取城市列表
  getCities: async (keyword?: string): Promise<LocationResponse> => {
    const params: any = {};
    if (keyword) {
      params.keyword = keyword;
    }
    
    const response = await api.get('/api/cities', { params });
    return response.data;
  },

  // 获取热门城市
  getPopularCities: async (): Promise<LocationResponse> => {
    const response = await api.get('/api/cities/popular');
    return response.data;
  },
};