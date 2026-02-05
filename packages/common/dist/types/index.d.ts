export interface PaginationParams {
    page: number;
    pageSize: number;
}
export interface PaginationResponse<T = any> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface BaseResponse<T = any> {
    success: boolean;
    code: number;
    message: string;
    data: T;
    timestamp: number;
}
export interface UserInfo {
    id: number;
    username: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}
export interface HotelInfo {
    id: number;
    name: string;
    description: string;
    address: string;
    price: number;
    images: string[];
    rating: number;
    amenities: string[];
    createdAt: string;
    updatedAt: string;
}
