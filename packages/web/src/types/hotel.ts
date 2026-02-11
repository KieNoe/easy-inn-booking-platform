export type HotelStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface Hotel {
  hotelId: number;
  name: string;
  description: string;
  address: string;
  price: number;
  images: string[];
  rating: number;
  amenities: string[];
  status: HotelStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HotelBasicInfo {
  nameCn: string;
  nameEn: string;
  star: number;
  openDate: string;
  address: string;
}

export interface HotelPriceRange {
  min: number;
  max: number;
}

export interface HotelRoomType {
  name: string;
  bedType: string;
  area: number;
  price: number;
  stock: number;
}

export interface HotelPromotion {
  title: string;
  type: string;
  value: number;
}

export interface HotelNearbyInfo {
  attractions?: string[];
  transport?: string[];
  mall?: string[];
}

export interface HotelDraftRequest {
  name: string;
  description: string;
  address: string;
  price: number;
  images?: string[];
  amenities?: string[];
  basic: HotelBasicInfo;
  priceRange: HotelPriceRange;
  roomTypes: HotelRoomType[];
  nearby?: HotelNearbyInfo;
  promotions?: HotelPromotion[];
  status?: HotelStatus;
}

export type CreateHotelRequest = HotelDraftRequest;

export type UpdateHotelRequest = Partial<Hotel> | Partial<HotelDraftRequest>;

export interface UpdateHotelStatusRequest {
  status: HotelStatus;
}
