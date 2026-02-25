export interface RoomType {
  name: string; // 房型名称，如 "豪华大床房"
  bedType: string; // 床型，如 "大床" 或 "双床"
  area: number; // 房间面积（平方米）
  price: number; // 价格
  stock: number; // 库存/可预订数量
}

export interface Hotel {
  hotelId: string; // 唯一标识，必选
  name: string; // 酒店名称（中/英），必选
  description?: string; // 酒店描述，可选
  nameEn?: string; // 英文名，可选
  address: string; // 酒店地址，必选
  hotelRating: number;  // 酒店星级，必选
  rating: number; // 酒店评分，必选
  price: number; // 可用于排序的参考价格（比如最低价或均价），必选
  lowestPrice?: number; // 最低价，可选
  images: string[]; // 酒店图片轮播，用于列表页展示（如缩略图），必选
  location: {
    city: string; // 所在城市，用于筛选和展示
    district?: string; // 区/县，可选
    latitude?: number; // 纬度，可选（用于地图展示或附近推荐）
    longitude?: number; // 经度，可选
  }; // 位置信息，用于筛选和展示，必选
  amenities?: string[]; // 设施，如 "免费WiFi", "停车场"，可选但推荐
  roomTypes?: RoomType[]; // 房型列表，可选
  isDiscount?: boolean; // 是否有折扣，可选
  discountInfo?: string; // 折扣信息，如 "8折" 或 "满减"，可选
  reviewScore?: number; // 评分，如 4.5，用于排序和展示，推荐
  reviewCount?: number; // 评论数量，可选
  tags: string[]; // 标签，用于筛选和展示，如 ["亲子", "豪华", "免费停车"], 必选
  status: 'pending' | 'approved' | 'rejected'; // 是否营业中/已上线（可用于后台控制是否展示）
  createdAt: string; // 开业时间或创建时间，字符串类型，如 "2024-01-01T00:00:00.000Z"，必选
  updatedAt: string; // 最后更新时间，必选
}
