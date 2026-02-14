import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Text, Input, Picker, Button, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import Calendar from '../../components/Calendar';
import { locationService, CityItem } from '../../services/locationService';
import './index.css';

const SearchPage: Taro.FC = () => {
  const [destination, setDestination] = useState<string>(''); // 目的地
  const [cities, setCities] = useState<CityItem[]>([]); // 城市列表
  const [checkInDate, setCheckInDate] = useState<Date | null>(null); // 入住日期
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null); // 退房日期
  const [guests, setGuests] = useState<number>(2); // 入住人数
  const [showCalendar, setShowCalendar] = useState<boolean>(false); // 是否显示日历
  const [loading, setLoading] = useState<boolean>(true); // 加载状态

  // 获取城市数据
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        // 先尝试获取热门城市
        const response = await locationService.getPopularCities();
        if (response.code === 200) {
          setCities(response.data.cities || []);
        } else {
          // 如果获取热门城市失败，获取全部城市
          const allCitiesResponse = await locationService.getCities();
          if (allCitiesResponse.code === 200) {
            setCities(allCitiesResponse.data.cities || []);
          } else {
            // 如果API调用失败，使用默认列表作为备用
            setCities([
              { id: 1, name: '北京', pinyin: 'beijing', level: 1 },
              { id: 2, name: '上海', pinyin: 'shanghai', level: 1 },
              { id: 3, name: '广州', pinyin: 'guangzhou', level: 2 },
              { id: 4, name: '深圳', pinyin: 'shenzhen', level: 2 },
              { id: 5, name: '杭州', pinyin: 'hangzhou', level: 2 },
              { id: 6, name: '成都', pinyin: 'chengdu', level: 2 },
              { id: 7, name: '西安', pinyin: 'xian', level: 2 },
              { id: 8, name: '重庆', pinyin: 'chongqing', level: 1 },
            ]);
          }
        }
      } catch (error) {
        console.error('获取城市列表失败:', error);
        // 发生错误时使用默认列表
        setCities([
          { id: 1, name: '北京', pinyin: 'beijing', level: 1 },
          { id: 2, name: '上海', pinyin: 'shanghai', level: 1 },
          { id: 3, name: '广州', pinyin: 'guangzhou', level: 2 },
          { id: 4, name: '深圳', pinyin: 'shenzhen', level: 2 },
          { id: 5, name: '杭州', pinyin: 'hangzhou', level: 2 },
          { id: 6, name: '成都', pinyin: 'chengdu', level: 2 },
          { id: 7, name: '西安', pinyin: 'xian', level: 2 },
          { id: 8, name: '重庆', pinyin: 'chongqing', level: 1 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleDateSelect = (startDate: Date, endDate: Date | null) => {
    setCheckInDate(startDate);
    if (endDate) {
      setCheckOutDate(endDate);
      setShowCalendar(false);
    }
  };

  const handleSearch = () => {
    // 搜索逻辑
    console.log('搜索条件:', {
      destination,
      checkInDate: checkInDate ? checkInDate.toISOString().split('T')[0] : null,
      checkOutDate: checkOutDate ? checkOutDate.toISOString().split('T')[0] : null,
      guests
    });
    
    if (!checkInDate || !checkOutDate) {
      Taro.showToast({
        title: '请先选择入住和退房日期',
        icon: 'none'
      });
      return;
    }
    
    // 跳转到搜索结果页面
    Taro.navigateTo({
      url: `/pages/list/index?destination=${encodeURIComponent(destination)}&checkIn=${checkInDate.toISOString().split('T')[0]}&checkOut=${checkOutDate.toISOString().split('T')[0]}&guests=${guests}`
    });
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '选择日期';
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatDay = (date: Date | null): string => {
    if (!date) return '周X';
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  };

  const calculateStayNights = (): string => {
    if (!checkInDate || !checkOutDate) return '共?晚';
    
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `共${diffDays}晚`;
  };

  return (
    <View className="search-page">
      {/* 顶部 Banner */}
      <View className="banner-section">
        <Image 
          src="https://static.easy-inn.com/images/search-banner.jpg" 
          className="banner-image"
          mode="aspectFill"
        />
        <View className="banner-overlay">
          <Text className="banner-title">发现理想住宿</Text>
          <Text className="banner-subtitle">探索全球精选酒店</Text>
        </View>
      </View>

      {/* 核心查询区域 - 携程风格 */}
      <View className="search-form">
        <View className="input-group">
          <View className="input-label">
            <AtIcon value="location" size="16" color="#1890ff" />
            <Text className="label-text">目的地</Text>
          </View>
          <Picker
            mode="selector"
            range={cities.map(city => city.name)}
            onChange={(e) => {
              const index = parseInt(e.detail.value);
              setDestination(cities[index].name);
            }}
          >
            <View className="picker-input">
              <Input
                className="input-field"
                placeholder={loading ? "加载中..." : "输入目的地"}
                value={destination}
                disabled={loading}
              />
              <Text className="arrow-down">▼</Text>
            </View>
          </Picker>
        </View>

        {/* 日期选择区域 - 携程风格 */}
        <View 
          className="date-selection"
          onClick={() => setShowCalendar(true)}
        >
          <View className="date-item">
            <Text className="date-label">入住</Text>
            <View className="date-value">
              <Text className="date-number">{formatDate(checkInDate)}</Text>
              <Text className="date-day">{formatDay(checkInDate)}</Text>
            </View>
          </View>
          
          <View className="date-separator">
            <View className="separator-line"></View>
            <Text className="nights-count">{calculateStayNights()}</Text>
          </View>
          
          <View className="date-item">
            <Text className="date-label">离店</Text>
            <View className="date-value">
              <Text className="date-number">{formatDate(checkOutDate)}</Text>
              <Text className="date-day">{formatDay(checkOutDate)}</Text>
            </View>
          </View>
        </View>

        <View className="input-group">
          <View className="input-label">
            <AtIcon value="user" size="16" color="#1890ff" />
            <Text className="label-text">入住人数</Text>
          </View>
          <Picker
            mode="selector"
            range={[1, 2, 3, 4, 5, 6].map(num => `${num}人`)}
            onChange={(e) => {
              const index = parseInt(e.detail.value);
              setGuests([1, 2, 3, 4, 5, 6][index]);
            }}
          >
            <View className="picker-input">
              <Input
                className="input-field"
                placeholder="选择人数"
                value={`${guests}人`}
                disabled
              />
              <Text className="arrow-down">▼</Text>
            </View>
          </Picker>
        </View>
      </View>

      {/* 查询按钮 - 携程风格 */}
      <View className="search-button-container">
        <Button 
          className="search-button" 
          onClick={handleSearch}
        >
          搜索酒店
        </Button>
      </View>

      {/* 日历弹窗 - 携程风格 */}
      {showCalendar && (
        <View className="calendar-modal">
          <View className="calendar-modal-content">
            <View className="calendar-modal-header">
              <Text className="close-btn" onClick={() => setShowCalendar(false)}>×</Text>
              <Text className="calendar-title">选择日期</Text>
            </View>
            <Calendar
              startDate={checkInDate || undefined}
              endDate={checkOutDate || undefined}
              onDateSelect={handleDateSelect}
              mode="range"
            />
            <View className="calendar-actions">
              <Button 
                className="confirm-btn" 
                onClick={() => setShowCalendar(false)}
                disabled={!checkInDate || !checkOutDate}
              >
                确定
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchPage;