export type HotelStatus = 'pending' | 'approved' | 'rejected';

export interface Hotel {
	hotelId: number;
	name: string;
	address: string;
	status: HotelStatus;
	star?: number;
	openDate?: string;
	priceRange?: {
		min: number;
		max: number;
	};
	roomTypes?: string[];
}
