import { api } from '@/utils/api';
import { Hotel, CreateHotelRequest, UpdateHotelStatusRequest } from '@/types/hotel';

export interface GetHotelsParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}

export const hotelService = {
  // 获取酒店列表
  getHotels: async (params: GetHotelsParams = {}) => {
    const response = await api.get('/hotels', { params });
    return response;
  },

  // 获取单个酒店详情
  getHotelById: async (id: number) => {
    const response = await api.get(`/hotels/${id}`);
    return response;
  },

  // 创建酒店
  createHotel: async (data: CreateHotelRequest) => {
    const response = await api.post('/hotels', data);
    return response;
  },

  // 更新酒店状态
  updateHotelStatus: async (id: number, data: UpdateHotelStatusRequest) => {
    const response = await api.put(`/hotels/${id}/status`, data);
    return response;
  },

  // 删除酒店
  deleteHotel: async (id: number) => {
    const response = await api.delete(`/hotels/${id}`);
    return response;
  },
};
