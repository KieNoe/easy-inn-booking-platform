import { CreateHotelRequest, UpdateHotelRequest, UpdateHotelStatusRequest, Hotel } from '@/types/hotel';
import { MOCK_HOTELS } from './contants';

export interface GetHotelsParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}

// Mock数据存储
let mockHotels: Hotel[] = MOCK_HOTELS;
let mockHotelId = 3001;

export const hotelService = {
  // 获取酒店列表
  getHotels: async (params: GetHotelsParams = {}) => {
    console.log('getHotels', params);
    // 根据参数过滤酒店列表
    let filteredHotels = [...mockHotels];

    if (params.search) {
      filteredHotels = filteredHotels.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          hotel.description.toLowerCase().includes(params.search!.toLowerCase()),
      );
    }

    if (params.status) {
      filteredHotels = filteredHotels.filter((hotel) => hotel.status === params.status);
    }

    const start = params.page && params.size ? (params.page! - 1) * params.size! : 0;
    const end = params.page && params.size ? start + params.size! : filteredHotels.length;

    return {
      code: 200,
      message: '获取成功',
      data: {
        content: filteredHotels.slice(start, end),
        totalElements: filteredHotels.length,
        totalPages: Math.ceil(filteredHotels.length / (params.size || 10)),
        currentPage: params.page || 0,
      },
    };
  },

  // 获取单个酒店详情
  getHotelById: async (id: number) => {
    console.log('getHotelById', id);
    const hotel = mockHotels.find((h) => h.hotelId === id);
    if (!hotel) {
      return {
        code: 404,
        message: '酒店不存在',
        data: null,
      };
    }
    return {
      code: 200,
      message: '获取成功',
      data: hotel,
    };
  },

  // 创建酒店
  createHotel: async (data: CreateHotelRequest) => {
    console.log('createHotel', data);
    const newHotel: Hotel = {
      hotelId: mockHotelId++,
      name: data.name,
      description: data.description,
      address: data.address,
      price: data.price,
      images: data.images || [],
      rating: 0,
      amenities: data.amenities || [],
      status: data.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockHotels.unshift(newHotel);
    return {
      code: 200,
      message: '创建成功',
      data: newHotel,
    };
  },

  // 更新酒店信息
  updateHotel: async (id: number, data: UpdateHotelRequest) => {
    console.log('updateHotel', id, data);
    const index = mockHotels.findIndex((hotel) => hotel.hotelId === id);
    if (index === -1) {
      // 如果酒店不存在，创建一个新的
      const newHotel: Hotel = {
        hotelId: id,
        name: data.name || '',
        description: data.description || '',
        address: data.address || '',
        price: data.price || 0,
        images: data.images || [],
        rating: 'rating' in data ? (data as Partial<Hotel>).rating || 0 : 0,
        amenities: data.amenities || [],
        status: data.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockHotels.unshift(newHotel);
      return {
        code: 200,
        message: '创建并更新成功',
        data: newHotel,
      };
    }

    const updatedHotel = {
      ...mockHotels[index],
      ...data,
      hotelId: id,
      updatedAt: new Date().toISOString(),
    };
    mockHotels[index] = updatedHotel;
    return {
      code: 200,
      message: '更新成功',
      data: updatedHotel,
    };
  },

  // 更新酒店状态
  updateHotelStatus: async (id: number, data: UpdateHotelStatusRequest) => {
    console.log('updateHotelStatus', id, data);
    const index = mockHotels.findIndex((hotel) => hotel.hotelId === id);
    if (index === -1) {
      return {
        code: 404,
        message: '酒店不存在',
        data: null,
      };
    }

    const updatedHotel = {
      ...mockHotels[index],
      status: data.status,
      updatedAt: new Date().toISOString(),
    };
    mockHotels[index] = updatedHotel;

    return {
      code: 200,
      message: '状态更新成功',
      data: updatedHotel,
    };
  },

  // 删除酒店
  deleteHotel: async (id: number) => {
    console.log('deleteHotel', id);
    const initialLength = mockHotels.length;
    mockHotels = mockHotels.filter((hotel) => hotel.hotelId !== id);
    const deleted = initialLength > mockHotels.length;

    return {
      code: 200,
      message: deleted ? '删除成功' : '酒店不存在',
      data: null,
    };
  },
};
