import Taro, { useState } from '@tarojs/taro';
import { View, Text, Input, Picker, Button, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.css';

interface CityItem {
  id: number;
  name: string;
}

const SearchPage: Taro.FC = () => {
  const [destination, setDestination] = useState<string>(''); // 目的地
  const [checkInDate, setCheckInDate] = useState<string>(''); // 入住日期
  const [checkOutDate, setCheckOutDate] = useState<string>(''); // 退房日期
  const [guests, setGuests] = useState<number>(2); // 入住人数

  // 模拟城市数据
  const cities: CityItem[] = [
    { id: 1, name: '北京' },
    { id: 2, name: '上海' },
    { id: 3, name: '广州' },
    { id: 4, name: '深圳' },
    { id: 5, name: '杭州' },
    { id: 6, name: '成都' },
    { id: 7, name: '西安' },
    { id: 8, name: '重庆' },
  ];

  const handleSearch = () => {
    // 搜索逻辑
    console.log('搜索条件:', {
      destination,
      checkInDate,
      checkOutDate,
      guests,
    });

    // 跳转到搜索结果页面
    Taro.navigateTo({
      url: `/pages/list/index?destination=${encodeURIComponent(destination)}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}`,
    });
  };

  return (
    <View className="search-page">
      {/* 顶部 Banner */}
      <View className="banner-section">
        <Image src="https://static.easy-inn.com/images/search-banner.jpg" className="banner-image" mode="aspectFill" />
        <View className="banner-overlay">
          <Text className="banner-title">发现理想住宿</Text>
          <Text className="banner-subtitle">探索全球精选酒店</Text>
        </View>
      </View>

      {/* 核心查询区域 */}
      <View className="search-form">
        <View className="input-group">
          <View className="input-label">
            <AtIcon value="location" size="16" color="#1890ff" />
            <Text className="label-text">目的地</Text>
          </View>
          <Picker
            mode="selector"
            range={cities.map((city) => city.name)}
            onChange={(e) => {
              const index = parseInt(e.detail.value);
              setDestination(cities[index].name);
            }}
          >
            <View className="picker-input">
              <Input className="input-field" placeholder="输入目的地" value={destination} disabled />
              <Text className="arrow-down">▼</Text>
            </View>
          </Picker>
        </View>

        <View className="input-row">
          <View className="input-group half-width">
            <View className="input-label">
              <AtIcon value="calendar" size="16" color="#1890ff" />
              <Text className="label-text">入住</Text>
            </View>
            <Picker mode="date" onChange={(e) => setCheckInDate(e.detail.value)} value={checkInDate}>
              <View className="picker-input">
                <Input className="input-field" placeholder="选择日期" value={checkInDate} disabled />
                <Text className="arrow-down">▼</Text>
              </View>
            </Picker>
          </View>

          <View className="input-group half-width">
            <View className="input-label">
              <AtIcon value="calendar" size="16" color="#1890ff" />
              <Text className="label-text">离店</Text>
            </View>
            <Picker mode="date" onChange={(e) => setCheckOutDate(e.detail.value)} value={checkOutDate}>
              <View className="picker-input">
                <Input className="input-field" placeholder="选择日期" value={checkOutDate} disabled />
                <Text className="arrow-down">▼</Text>
              </View>
            </Picker>
          </View>
        </View>

        <View className="input-group">
          <View className="input-label">
            <AtIcon value="user" size="16" color="#1890ff" />
            <Text className="label-text">入住人数</Text>
          </View>
          <Picker
            mode="selector"
            range={[1, 2, 3, 4, 5, 6].map((num) => `${num}人`)}
            onChange={(e) => {
              const index = parseInt(e.detail.value);
              setGuests([1, 2, 3, 4, 5, 6][index]);
            }}
          >
            <View className="picker-input">
              <Input className="input-field" placeholder="选择人数" value={`${guests}人`} disabled />
              <Text className="arrow-down">▼</Text>
            </View>
          </Picker>
        </View>
      </View>

      {/* 查询按钮 */}
      <View className="search-button-container">
        <Button className="search-button" onClick={handleSearch}>
          搜索酒店
        </Button>
      </View>
    </View>
  );
};

export default SearchPage;
