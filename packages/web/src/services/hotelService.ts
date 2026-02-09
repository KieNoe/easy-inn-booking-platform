import type { Hotel, HotelStatus } from '@/types/hotel';

export interface GetHotelsParams {
  page: number;
  size: number;
  search?: string;
  status?: HotelStatus;
}

export interface HotelListResponse {
  content: Hotel[];
  totalElements: number;
}

const mockHotels: Hotel[] = [
  {
    hotelId: 1001,
    name: '易宿臻选酒店',
    address: '上海市静安区共和新路1000号',
    status: 'pending',
    star: 5,
    openDate: '2022-06-18',
    priceRange: { min: 520, max: 1880 },
    roomTypes: ['豪华大床房', '行政套房'],
  },
  {
    hotelId: 1002,
    name: '海湾商务酒店',
    address: '上海市黄浦区南京东路88号',
    status: 'approved',
    star: 4,
    openDate: '2019-03-12',
    priceRange: { min: 420, max: 1280 },
    roomTypes: ['商务大床房', '景观双床房'],
  },
  {
    hotelId: 1003,
    name: '城市花园酒店',
    address: '上海市浦东新区世纪大道200号',
    status: 'rejected',
    star: 3,
    openDate: '2016-10-08',
    priceRange: { min: 320, max: 860 },
    roomTypes: ['亲子房', '景观双床房'],
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const hotelService = {
  async getHotels(params: GetHotelsParams): Promise<HotelListResponse> {
    const { page, size, search, status } = params;
    await delay(200);

    let result = mockHotels;
    if (status) {
      result = result.filter((item) => item.status === status);
    }
    if (search) {
      const keyword = search.trim();
      if (keyword) {
        result = result.filter((item) => item.name.includes(keyword) || item.address.includes(keyword));
      }
    }

    const start = (page - 1) * size;
    const content = result.slice(start, start + size);

    return {
      content,
      totalElements: result.length,
    };
  },

  async updateHotelStatus(id: number, payload: { status: HotelStatus }) {
    await delay(150);
    const target = mockHotels.find((item) => item.hotelId === id);
    if (target) {
      target.status = payload.status;
    }
    return { success: true };
  },
};
