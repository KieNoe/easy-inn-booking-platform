import { useState, useCallback } from 'react';
import { message } from 'antd';
import { hotelService } from '@/services/hotelService';
import type { Hotel } from '@/types/hotel';

interface UseHotelStateReturn {
  hotels: Hotel[];
  loading: boolean;
  approving: boolean;
  rejecting: boolean;
  updating: boolean;
  fetchHotels: (page?: number, size?: number, search?: string, status?: string) => Promise<void>;
  approveHotel: (id: number) => Promise<void>;
  rejectHotel: (id: number) => Promise<void>;
  updateHotel: (id: number, data: Partial<Hotel>) => Promise<void>;
  deleteHotel: (id: number) => Promise<void>;
}

export const useHotelState = (): UseHotelStateReturn => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 获取酒店列表
  const fetchHotels = useCallback(async (page = 1, size = 10, search?: string, status?: string) => {
    setLoading(true);
    try {
      const params: any = { page, size };
      if (search) params.search = search;
      if (status) params.status = status;

      const response = await hotelService.getHotels(params);
      const { content } = response.data.data;
      setHotels(content || []);
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
      message.error('获取酒店列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 审核通过酒店
  const approveHotel = useCallback(async (id: number) => {
    setApproving(true);
    try {
      const response = await hotelService.updateHotelStatus(id, { status: 'approved' });
      message.success('酒店已通过审核');
      
      // 更新本地状态
      setHotels(prev => prev.map(hotel => 
        hotel.hotelId === id ? { ...response.data.data, status: 'approved' } : hotel
      ));
    } catch (error) {
      console.error('Failed to approve hotel:', error);
      message.error('审核通过失败');
    } finally {
      setApproving(false);
    }
  }, []);

  // 审核拒绝酒店
  const rejectHotel = useCallback(async (id: number) => {
    setRejecting(true);
    try {
      const response = await hotelService.updateHotelStatus(id, { status: 'rejected' });
      message.success('酒店已拒绝');
      
      // 更新本地状态
      setHotels(prev => prev.map(hotel => 
        hotel.hotelId === id ? { ...response.data.data, status: 'rejected' } : hotel
      ));
    } catch (error) {
      console.error('Failed to reject hotel:', error);
      message.error('拒绝失败');
    } finally {
      setRejecting(false);
    }
  }, []);

  // 更新酒店信息
  const updateHotel = useCallback(async (id: number, data: Partial<Hotel>) => {
    setUpdating(true);
    try {
      const response = await hotelService.updateHotel(id, data);
      const updatedHotel = response.data.data;
      
      setHotels(prev => prev.map(hotel => 
        hotel.hotelId === id ? updatedHotel : hotel
      ));
      
      message.success('酒店信息更新成功');
    } catch (error) {
      console.error('Failed to update hotel:', error);
      message.error('更新酒店信息失败');
    } finally {
      setUpdating(false);
    }
  }, []);

  // 删除酒店
  const deleteHotel = useCallback(async (id: number) => {
    try {
      await hotelService.deleteHotel(id);
      message.success('酒店删除成功');
      
      // 从本地状态移除
      setHotels(prev => prev.filter(hotel => hotel.hotelId !== id));
    } catch (error) {
      console.error('Failed to delete hotel:', error);
      message.error('删除酒店失败');
    }
  }, []);

  return {
    hotels,
    loading,
    approving,
    rejecting,
    updating,
    fetchHotels,
    approveHotel,
    rejectHotel,
    updateHotel,
    deleteHotel,
  };
};