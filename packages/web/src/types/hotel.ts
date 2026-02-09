export interface Hotel {
  hotelId: number;
  name: string;
  description: string;
  address: string;
  price: number;
  images: string[];
  rating: number;
  amenities: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelRequest {
  name: string;
  description: string;
  address: string;
  price: number;
  images?: string[];
  amenities?: string[];
}

export interface UpdateHotelStatusRequest {
  status: 'pending' | 'approved' | 'rejected';
}
