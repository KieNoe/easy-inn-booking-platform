import { View, Text, Image, Map, Button, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { AtIcon } from 'taro-ui';
import Calendar from '../../components/Calendar';
import { Hotel, RoomType } from '../../../types/hotel';
import './index.css';

interface NearbyPlace {
  id: number;
  name: string;
  category: string;
  distance: number;
  latitude: number;
  longitude: number;
}

const HotelDetailPage = () => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchResults, setSearchResults] = useState<NearbyPlace[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [guests] = useState<number>(2);

  // 获取酒店详情
  useEffect(() => {
    const fetchHotelDetail = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockHotel: Hotel = {
          hotelId: '1',
          name: '五星豪华大酒店',
          address: '北京市朝阳区建国路88号',
          description: '位于市中心的五星级酒店，交通便利，设施齐全。距离地铁站仅500米。',
          price: 899,
          rating: 4.8,
          hotelRating: 5,
          images: [
            'https://via.placeholder.com/375x200/cccccc/666666?text=酒店外观',
            'https://via.placeholder.com/375x200/cccccc/666666?text=大堂',
            'https://via.placeholder.com/375x200/cccccc/666666?text=客房',
          ],
          amenities: ['免费WiFi', '游泳池', '健身房', '餐厅', '会议室', '停车场'],
          roomTypes: [
            { name: '豪华大床房', bedType: '大床', area: 35, price: 599, stock: 10 },
            { name: '行政套房', bedType: '大床', area: 50, price: 899, stock: 5 },
            { name: '亲子房', bedType: '双床', area: 45, price: 799, stock: 8 },
            { name: '景观双床房', bedType: '双床', area: 40, price: 699, stock: 12 },
          ],
          location: {
            city: '北京',
            district: '朝阳区',
            latitude: 39.9042,
            longitude: 116.4074,
          },
          tags: ['五星酒店', '商务出差', '豪华住宿'],
          status: 'approved',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        };

        setHotel(mockHotel);
      } catch (error) {
        console.error('获取酒店详情失败:', error);
        Taro.showToast({
          title: '获取酒店详情失败',
          icon: 'none',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelDetail();
  }, []);

  // 获取附近地点
  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockNearbyPlaces: NearbyPlace[] = [
          { id: 1, name: '国贸商城', category: 'shopping', distance: 200, latitude: 39.91, longitude: 116.46 },
          { id: 2, name: '三里屯', category: 'attraction', distance: 1200, latitude: 39.93, longitude: 116.44 },
          { id: 3, name: '朝阳公园', category: 'attraction', distance: 1500, latitude: 39.95, longitude: 116.47 },
          { id: 4, name: '地铁国贸站', category: 'transportation', distance: 300, latitude: 39.9, longitude: 116.45 },
          { id: 5, name: '海底捞火锅', category: 'restaurant', distance: 400, latitude: 39.91, longitude: 116.46 },
          { id: 6, name: '家乐福超市', category: 'shopping', distance: 600, latitude: 39.92, longitude: 116.43 },
        ];

        setNearbyPlaces(mockNearbyPlaces);
      } catch (error) {
        console.error('获取附近地点失败:', error);
      }
    };

    if (hotel) {
      fetchNearbyPlaces();
    }
  }, [hotel]);

  // 图片轮播
  const handleImageScroll = (e: any) => {
    if (!hotel?.images) return;
    const scrollLeft = e.detail.scrollLeft;
    const imageWidth = 375;
    const newIndex = Math.round(scrollLeft / imageWidth);
    setCurrentImageIndex(Math.min(newIndex, hotel.images.length - 1));
  };

  // 日期选择
  const handleDateSelect = (startDate: Date, endDate: Date | null) => {
    setCheckInDate(startDate);
    if (endDate) {
      setCheckOutDate(endDate);
      setShowCalendar(false);
    }
  };

  // 格式化日期
  const formatDate = (date: Date | null): string => {
    if (!date) return '选择日期';
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 计算入住天数
  const calculateNights = (): number => {
    if (!checkInDate || !checkOutDate) return 1;
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  // 返回上一页
  const goBack = () => {
    Taro.navigateBack();
  };

  // 拨打电话
  const makePhoneCall = () => {
    Taro.showToast({
      title: '客服: 400-123-4567',
      icon: 'none',
    });
  };

  // 计算距离文本
  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  // 获取类别图标
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'restaurant':
        return 'fork';
      case 'attraction':
        return 'star';
      case 'transportation':
        return 'bus';
      case 'shopping':
        return 'shopping-cart';
      default:
        return 'location';
    }
  };

  // 获取用户位置
  const getUserLocation = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: () => {
        Taro.showToast({
          title: '定位成功',
          icon: 'success',
        });
      },
      fail: () => {
        Taro.showModal({
          title: '定位失败',
          content: '请检查位置权限是否开启',
          showCancel: true,
          confirmText: '去设置',
        });
      },
    });
  };

  // 搜索
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filteredResults = nearbyPlaces.filter((place) =>
      place.name.toLowerCase().includes(searchKeyword.toLowerCase()),
    );

    setSearchResults(filteredResults);
    setShowSearchResults(true);
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchKeyword('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // 打开地图
  const navigateToMap = (latitude: number, longitude: number, name: string) => {
    Taro.openLocation({
      latitude,
      longitude,
      name,
      address: name,
      scale: 16,
    });
  };

  if (isLoading) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!hotel) {
    return (
      <View className="error-container">
        <Text>酒店信息加载失败</Text>
      </View>
    );
  }

  return (
    <ScrollView className="hotel-detail-page" scrollY>
      {/* 顶部导航头 */}
      <View className="header-bar">
        <Button className="back-btn" onClick={goBack}>
          <AtIcon value="chevron-left" size="20" color="#333" />
        </Button>
        <Text className="header-title">{hotel.name}</Text>
        <View className="header-placeholder"></View>
      </View>

      {/* 大图 Banner */}
      <View className="image-banner-section">
        <ScrollView className="image-slider" scrollX onScroll={handleImageScroll}>
          {hotel.images.map((image, index) => (
            <Image key={index} src={image} className="banner-image" mode="aspectFill" />
          ))}
        </ScrollView>
        {/* 图片指示器 */}
        <View className="image-indicator">
          {hotel.images.map((_: string, index: number) => (
            <View key={index} className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`} />
          ))}
        </View>
      </View>

      {/* 酒店基础信息 */}
      <View className="hotel-info-card">
        <View className="info-header">
          <View className="info-left">
            <Text className="hotel-name">{hotel.name}</Text>
            <View className="rating-container">
              <View className="rating-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <AtIcon key={i} value="star" size="14" color={i < hotel.hotelRating ? '#FFD700' : '#ddd'} />
                ))}
              </View>
              <Text className="rating-score">{hotel.rating}分</Text>
            </View>
          </View>
          <View className="price-badge">
            <Text className="price">¥{hotel.price}</Text>
            <Text className="price-suffix">起/晚</Text>
          </View>
        </View>

        {/* 地址信息 */}
        <View className="address-info">
          <AtIcon value="map-pin" size="14" color="#999" />
          <Text className="address-text">{hotel.address}</Text>
        </View>

        {/* 设施列表 */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <View className="amenities-section">
            <View className="amenities-list">
              {hotel.amenities.slice(0, 4).map((amenity, index) => (
                <View key={index} className="amenity-tag">
                  <Text>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* 日历+人间夜 Banner */}
      <View className="booking-banner">
        <View className="date-selector-group">
          <View className="date-item" onClick={() => setShowCalendar(!showCalendar)}>
            <Text className="date-label">入住</Text>
            <Text className="date-value">{formatDate(checkInDate)}</Text>
          </View>
          <View className="date-divider"></View>
          <View className="date-item">
            <Text className="date-label">退房</Text>
            <Text className="date-value">{formatDate(checkOutDate)}</Text>
          </View>
          <View className="date-divider"></View>
          <View className="date-item">
            <Text className="date-label">住宿</Text>
            <Text className="date-value">{calculateNights()}晚</Text>
          </View>
          <View className="date-divider"></View>
          <View className="date-item">
            <Text className="date-label">人数</Text>
            <Text className="date-value">{guests}人</Text>
          </View>
        </View>

        {/* 日历组件 */}
        {showCalendar && (
          <View className="calendar-wrapper">
            <Calendar
              minDate={new Date()}
              maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
              onDateSelect={handleDateSelect}
              mode="range"
            />
          </View>
        )}
      </View>

      {/* 房型价格列表 */}
      {hotel.roomTypes && hotel.roomTypes.length > 0 && (
        <View className="room-list-section">
          <Text className="section-title">房型选择</Text>
          {hotel.roomTypes.map((room: RoomType, index: number) => (
            <View key={index} className="room-card">
              <View className="room-header">
                <View>
                  <Text className="room-name">{room.name}</Text>
                  <View className="room-meta">
                    <Text className="room-meta-item">{room.bedType}</Text>
                    <Text className="room-meta-item">{room.area}㎡</Text>
                  </View>
                </View>
              </View>
              <View className="room-footer">
                <View className="room-price-info">
                  <Text className="room-price">¥{room.price}</Text>
                  <Text className="room-price-suffix">/晚</Text>
                </View>
                <Button className="room-select-btn">预订</Button>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 位置信息 */}
      <View className="location-section">
        <View className="section-header">
          <Text className="section-title">位置信息</Text>
          <Button className="location-btn" onClick={getUserLocation}>
            <AtIcon value="location" size="16" color="#1890ff" />
            <Text>获取位置</Text>
          </Button>
        </View>

        <View className="hotel-address">
          <AtIcon value="map-pin" size="16" color="#666" />
          <Text className="address-text">{hotel.address}</Text>
        </View>

        {/* 地图 */}
        {hotel.location?.latitude && hotel.location?.longitude && (
          <View className="map-container">
            <Map
              className="hotel-map"
              longitude={hotel.location.longitude}
              latitude={hotel.location.latitude}
              markers={[
                {
                  id: 1,
                  latitude: hotel.location.latitude,
                  longitude: hotel.location.longitude,
                  title: hotel.name,
                  width: 20,
                  height: 20,
                  iconPath: '',
                },
              ]}
              scale={16}
              onClick={() => navigateToMap(hotel.location?.latitude || 0, hotel.location?.longitude || 0, hotel.name)}
              onError={() => {
                console.log('地图加载出错');
              }}
            />
          </View>
        )}
      </View>

      {/* 周边搜索 */}
      <View className="search-section">
        <View className="search-header">
          <Text className="section-title">周边搜索</Text>
        </View>

        <View className="search-bar">
          <Input
            className="search-input"
            placeholder="搜索周边地点、餐厅、景点..."
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
            onConfirm={handleSearch}
          />
          {searchKeyword && (
            <Button className="clear-btn" onClick={clearSearch}>
              ×
            </Button>
          )}
          <Button className="search-btn" onClick={handleSearch}>
            搜索
          </Button>
        </View>

        {showSearchResults && (
          <View className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((place) => (
                <View
                  key={place.id}
                  className="search-result-item"
                  onClick={() => navigateToMap(place.latitude, place.longitude, place.name)}
                >
                  <View className="result-icon">
                    <AtIcon value={getCategoryIcon(place.category)} size="16" />
                  </View>
                  <View className="result-info">
                    <Text className="result-name">{place.name}</Text>
                    <Text className="result-category">{place.category}</Text>
                  </View>
                  <Text className="result-distance">{formatDistance(place.distance)}</Text>
                </View>
              ))
            ) : (
              <View className="no-results">
                <Text>未找到相关地点</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* 周边地点列表 */}
      <View className="nearby-section">
        <View className="section-header">
          <Text className="section-title">周边地点</Text>
        </View>

        <View className="nearby-list">
          {nearbyPlaces.map((place) => (
            <View
              key={place.id}
              className="nearby-item"
              onClick={() => navigateToMap(place.latitude, place.longitude, place.name)}
            >
              <View className="item-icon">
                <AtIcon value={getCategoryIcon(place.category)} size="16" />
              </View>
              <View className="item-info">
                <Text className="item-name">{place.name}</Text>
                <Text className="item-category">{place.category}</Text>
              </View>
              <Text className="item-distance">{formatDistance(place.distance)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 底部操作栏 */}
      <View className="action-bar">
        <Button className="action-btn contact-btn" onClick={makePhoneCall}>
          <AtIcon value="phone" size="16" />
          <Text>联系酒店</Text>
        </Button>
        <Button className="action-btn book-btn">
          <Text>立即预订</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default HotelDetailPage;
