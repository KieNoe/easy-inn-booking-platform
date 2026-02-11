export interface Hotel {
  id: string; // 唯一标识，必选
  name: string; // 酒店名称（中/英），必选
  nameEn?: string; // 英文名，可选
  address: string; // 酒店地址，必选
  starRating: number; // 酒店星级，如 3、4、5，必选
  roomTypes: RoomType[]; // 房型列表，必选（用于展示价格和房型）
  price: number; // 可用于排序的参考价格（比如最低价或均价），必选/重要
  lowestPrice?: number; // 最低价，可选（如果roomTypes中已包含价格，可以不单独放）
  images?: string[]; // 酒店图片轮播，用于列表页展示（如缩略图），可选但推荐
  thumbnail?: string; // 列表页展示用的缩略图，可选（可替代images[0]）
  location: {
    city: string; // 所在城市，用于筛选和展示
    district?: string; // 区/县，可选
    latitude?: number; // 纬度，可选（用于地图展示或附近推荐）
    longitude?: number; // 经度，可选
  };
  amenities?: string[]; // 设施，如 "免费WiFi", "停车场"，可选但推荐
  isDiscount?: boolean; // 是否有折扣，可选
  discountInfo?: string; // 折扣信息，如 "8折" 或 "满减"，可选
  reviewScore?: number; // 评分，如 4.5，用于排序和展示，推荐
  reviewCount?: number; // 评论数量，可选
  tags: string[]; // 标签，用于筛选和展示，如 ["亲子", "豪华", "免费停车"], 可选但推荐
  isOpen?: boolean; // 是否营业中/已上线，可选（可用于后台控制是否展示）
  createdAt?: string; // 开业时间或创建时间，字符串类型，如 "2020-01-01"，可选
  updatedAt?: string; // 最后更新时间，可选
}

interface RoomType {
  id: string; // 房型ID
  name: string; // 房型名称，如 "标准间", "大床房"
  description?: string; // 房型描述，可选
  price: number; // 价格（每晚），必选
  originalPrice?: number; // 原价，用于展示折扣，可选
  amenities?: string[]; // 房型设施，如 "WiFi", "早餐", 可选
  maxOccupancy?: number; // 最大入住人数，可选
  bedType?: string; // 床型，如 "1.8m大床", 可选
  thumbnail?: string; // 房型图片，可选
}