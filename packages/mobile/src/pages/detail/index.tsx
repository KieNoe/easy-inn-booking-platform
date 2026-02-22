import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Text, Image, Map, Button, Input, ScrollView } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.css';

interface Hotel {
  id: number;
  name: string;
  address: string;
  description: string;
  price: number;
  rating: number;
  images: string[];
  facilities: string[];
  latitude: number;
  longitude: number;
  phone: string;
}

interface NearbyPlace {
  id: number;
  name: string;
  category: string; // 'restaurant', 'attraction', 'transportation', 'shopping'
  distance: number; // 距离（米）
  latitude: number;
  longitude: number;
}

const HotelDetailPage: Taro.FC = () => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchResults, setSearchResults] = useState<NearbyPlace[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 模拟获取酒店详情（实际应用中应从API获取）
  useEffect(() => {
    const fetchHotelDetail = async () => {
      setIsLoading(true);
      try {
        // 实际应用中，这里应该是真实的API调用
        // const response = await hotelService.getHotelDetail(hotelId);
        // setHotel(response.data);
        
        // 模拟数据
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockHotel: Hotel = {
          id: 1,
          name: "豪华大酒店",
          address: "北京市朝阳区建国路88号",
          description: "位于市中心的五星级酒店，交通便利，设施齐全。",
          price: 899,
          rating: 4.8,
          images: [
            "https://via.placeholder.com/375x200/cccccc/666666?text=酒店外观",
            "https://via.placeholder.com/375x200/cccccc/666666?text=大堂",
            "https://via.placeholder.com/375x200/cccccc/666666?text=客房"
          ],
          facilities: ["免费WiFi", "游泳池", "健身房", "餐厅", "会议室"],
          latitude: 39.9042, // 北京坐标
          longitude: 116.4074,
          phone: "010-12345678"
        };
        
        setHotel(mockHotel);
      } catch (error) {
        console.error('获取酒店详情失败:', error);
        Taro.showToast({
          title: '获取酒店详情失败',
          icon: 'none'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelDetail();
  }, []);

  // 获取附近地点数据
  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      try {
        // 实际应用中，这里应该是真实的API调用
        // const response = await locationService.getNearbyPlaces(hotelId);
        // setNearbyPlaces(response.data);
        
        // 模拟数据
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockNearbyPlaces: NearbyPlace[] = [
          { id: 1, name: "国贸商城", category: "shopping", distance: 200, latitude: 39.91, longitude: 116.46 },
          { id: 2, name: "三里屯", category: "attraction", distance: 1200, latitude: 39.93, longitude: 116.44 },
          { id: 3, name: "朝阳公园", category: "attraction", distance: 1500, latitude: 39.95, longitude: 116.47 },
          { id: 4, name: "地铁国贸站", category: "transportation", distance: 300, latitude: 39.90, longitude: 116.45 },
          { id: 5, name: "海底捞火锅", category: "restaurant", distance: 400, latitude: 39.91, longitude: 116.46 },
          { id: 6, name: "家乐福超市", category: "shopping", distance: 600, latitude: 39.92, longitude: 116.43 }
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

  // 获取用户当前位置
  const getUserLocation = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: (res) => {
        setUserLocation({
          latitude: res.latitude,
          longitude: res.longitude
        });
        Taro.showToast({
          title: '定位成功',
          icon: 'success'
        });
      },
      fail: () => {
        Taro.showModal({
          title: '定位失败',
          content: '请检查位置权限是否开启',
          showCancel: true,
          confirmText: '去设置',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 跳转到系统设置页面
              Taro.openSetting({
                success: (settingRes) => {
                  if (settingRes.authSetting['scope.userLocation']) {
                    // 用户开启了位置权限，重新获取位置
                    getUserLocation();
                  }
                }
              });
            }
          }
        });
      }
    });
  };

  // 搜索功能
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filteredResults = nearbyPlaces.filter(place =>
      place.name.toLowerCase().includes(searchKeyword.toLowerCase())
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

  // 跳转到地图查看位置
  const navigateToMap = (latitude: number, longitude: number, name: string) => {
    Taro.openLocation({
      latitude,
      longitude,
      name,
      address: name,
      scale: 16
    });
  };

  // 拨打电话
  const makePhoneCall = () => {
    if (hotel?.phone) {
      Taro.makePhoneCall({
        phoneNumber: hotel.phone
      });
    }
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
      {/* 酒店基本信息 */}
      <View className="hotel-info-section">
        <View className="hotel-image-slider">
          {hotel.images.map((image, index) => (
            <Image 
              key={index}
              src={image}
              className="hotel-image"
              mode="aspectFill"
            />
          ))}
        </View>
        
        <View className="hotel-basic-info">
          <Text className="hotel-name">{hotel.name}</Text>
          <View className="hotel-rating">
            <Text className="rating-score">{hotel.rating}</Text>
            <Text className="rating-text">分/10</Text>
          </View>
          <Text className="hotel-price">¥{hotel.price}<Text className="price-suffix">/晚起</Text></Text>
        </View>
        
        <View className="hotel-description">
          <Text>{hotel.description}</Text>
        </View>
      </View>

      {/* 位置信息和定位功能 */}
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
        
        {/* 地图组件 */}
        <View className="map-container">
          <Map
            className="hotel-map"
            longitude={hotel.longitude}
            latitude={hotel.latitude}
            markers={[
              {
                id: 1,
                latitude: hotel.latitude,
                longitude: hotel.longitude,
                title: hotel.name,
                iconPath: "/assets/images/hotel-marker.png",
                width: 20,
                height: 20
              }
            ]}
            scale={16}
            onClick={(e) => navigateToMap(hotel.latitude, hotel.longitude, hotel.name)}
          />
        </View>
      </View>

      {/* 关键字搜索功能 */}
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
              searchResults.map(place => (
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
          {nearbyPlaces.map(place => (
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
        <Button 
          className="action-btn navigate-btn" 
          onClick={() => navigateToMap(hotel.latitude, hotel.longitude, hotel.name)}
        >
          <AtIcon value="navigation" size="16" />
          <Text>前往酒店</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default HotelDetailPage;