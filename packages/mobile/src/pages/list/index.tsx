import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';
import { Hotel } from '../../../types/hotel';
import { HOTEL_LIST } from './constants';
import { AtSearchBar, AtTag, AtIcon, AtButton } from 'taro-ui';
import 'taro-ui/dist/style/components/search-bar.scss';
import 'taro-ui/dist/style/components/tag.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/divider.scss';
import 'taro-ui/dist/style/components/badge.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/drawer.scss';
import 'taro-ui/dist/style/components/list.scss';
import 'taro-ui/dist/style/components/checkbox.scss';
import 'taro-ui/dist/style/components/radio.scss';
import 'taro-ui/dist/style/components/flex.scss';
import Taro from '@tarojs/taro';
import { ApiClient } from '@easy-inn-booking-monorepo/common';

// 创建 API 客户端实例
const apiClient = new ApiClient('https://example.com');

// 筛选选项
const SORT_OPTIONS = [
  { label: '欢迎度排序', value: 'popular' },
  { label: '位置距离', value: 'distance' },
  { label: '价格/星级', value: 'price' },
];

const FILTER_TAGS = [
  { label: '双床房', value: 'double' },
  { label: '含早餐', value: 'breakfast' },
  { label: '可订', value: 'available' },
  { label: '亲子友好', value: 'family' },
  { label: '健身房', value: 'gym' },
  { label: '高分', value: 'high_score' },
];

export default function List() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  const [searchValue, setSearchValue] = useState('');
  const [currentCity] = useState('上海');
  const [checkInDate] = useState('01-09');
  const [checkOutDate] = useState('01-10');
  const [nights] = useState(1);
  const [activeSort, setActiveSort] = useState('popular');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagColors, setTagColors] = useState<{ [key: string]: string }>({});
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  // 筛选状态
  const [filterState, setFilterState] = useState({
    priceRange: { min: '0', max: '5000' },
    starRange: { min: '3', max: '5' },
    ratingRange: { min: '3', max: '5' },
    hasDiscount: 'all', // 'all', 'yes'
  });

  // 默认筛选状态（用于重置）
  const defaultFilterState = {
    priceRange: { min: '0', max: '5000' },
    starRange: { min: '3', max: '5' },
    ratingRange: { min: '3', max: '5' },
    hasDiscount: 'all' as const,
  };

  // 搜索防抖定时器
  const searchTimerRef = useRef<any>(null);

  // 获取酒店列表
  const fetchHotelList = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        city: currentCity,
        checkInDate,
        checkOutDate,
        keyword: searchValue,
        sort: activeSort,
        tags: selectedTags.join(','),
        priceMin: filterState.priceRange.min,
        priceMax: filterState.priceRange.max,
        starMin: filterState.starRange.min,
        starMax: filterState.starRange.max,
        ratingMin: filterState.ratingRange.min,
        ratingMax: filterState.ratingRange.max,
        hasDiscount: filterState.hasDiscount === 'yes' ? true : undefined,
      };

      const response = await apiClient.get<{ data: Hotel[] }>('/api/hotels', { params });
      setHotels(response.data || []);
    } catch (error) {
      console.error('获取酒店列表失败:', error);
      Taro.showToast({ title: '获取列表失败', icon: 'none' });
      // 使用模拟数据作为后备
      setHotels(HOTEL_LIST);
    } finally {
      setLoading(false);
    }
  }, [currentCity, checkInDate, checkOutDate, searchValue, activeSort, selectedTags, filterState]);

  // 初始化加载
  useEffect(() => {
    fetchHotelList();
  }, []);

  // 条件变化时重新拉取（搜索使用防抖）
  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      fetchHotelList();
    }, 500);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchValue, activeSort, selectedTags, filterState.hasDiscount]);

  // 处理搜索
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // 处理搜索确认
  const handleSearchConfirm = () => {
    fetchHotelList();
  };

  // 处理城市选择
  const handleCityClick = () => {
    Taro.showToast({ title: '选择城市', icon: 'none' });
  };

  // 处理日期选择
  const handleDateClick = () => {
    Taro.showToast({ title: '选择日期', icon: 'none' });
  };

  // 处理排序切换
  const handleSortChange = (value: string) => {
    setActiveSort(value);
  };

  // 处理标签选择
  const handleTagClick = (value: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(value)) {
        return prev.filter((tag) => tag !== value);
      }
      return [...prev, value];
    });

    // 切换标签颜色
    setTagColors((prevColors) => {
      const newColors = { ...prevColors };
      if (newColors[value] === '#1890ff') {
        delete newColors[value];
      } else {
        newColors[value] = '#1890ff';
      }
      return newColors;
    });
  };

  // 处理筛选抽屉
  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen);
  };

  // 重置筛选条件
  const handleResetFilter = () => {
    setFilterState(defaultFilterState);
    setSelectedTags([]);
    setTagColors({});
    setActiveSort('popular');
    setSearchValue('');
    Taro.showToast({ title: '已重置筛选', icon: 'success' });
  };

  // 确认筛选
  const handleConfirmFilter = () => {
    setIsFilterDrawerOpen(false);
    fetchHotelList();
  };

  // 跳转到详情页
  const navigateToDetail = (hotelId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotelId}`,
    });
  };

  // 渲染星级
  const renderStars = (count: number) => {
    return Array(count)
      .fill(null)
      .map((_, i) => <AtIcon key={i} value="star-2" size="12" color="#FFA500" />);
  };
  return (
    <View className="hotel-list-page">
      {/* 顶部搜索栏 */}
      <View className="search-header">
        <View className="city-date-bar">
          <View className="city-selector" onClick={handleCityClick}>
            <Text className="city-name">{currentCity}</Text>
            <AtIcon value="chevron-down" size="14" color="#333" />
          </View>
          <View className="date-selector" onClick={handleDateClick}>
            <Text className="date-text">
              住 {checkInDate} / 离 {checkOutDate}
            </Text>
            <Text className="nights-badge">{nights}晚</Text>
          </View>
          <View className="location-icon">
            <AtIcon value="map-pin" size="18" color="#666" />
            <Text className="location-text">地图</Text>
          </View>
        </View>
        <AtSearchBar
          value={searchValue}
          onChange={handleSearchChange}
          onConfirm={handleSearchConfirm}
          placeholder="位置/品牌/酒店"
          className="hotel-search-bar"
        />
      </View>

      {/* 筛选区域 */}
      <View className="filter-section">
        {/* 排序选项 */}
        <View className="sort-bar">
          {SORT_OPTIONS.map((option) => (
            <View
              key={option.value}
              className={`sort-item ${activeSort === option.value ? 'active' : ''}`}
              onClick={() => handleSortChange(option.value)}
            >
              <Text className="sort-label">{option.label}</Text>
              {option.value !== 'popular' && (
                <AtIcon value="chevron-down" size="12" color={activeSort === option.value ? '#0056b3' : '#999'} />
              )}
            </View>
          ))}
          <View className="sort-item filter-btn" onClick={toggleFilterDrawer}>
            <Text className="sort-label">筛选</Text>
            <AtIcon value="filter" size="12" color="#666" />
          </View>
        </View>

        {/* 标签筛选 */}
        <ScrollView className="tag-scroll" scrollX showScrollbar={false}>
          <View className="tag-list">
            {FILTER_TAGS.map((tag) => (
              <AtTag
                key={tag.value}
                className={`filter-tag ${selectedTags.includes(tag.value) ? 'at-tag--active' : ''}`}
                type={selectedTags.includes(tag.value) ? 'primary' : 'default'}
                active={selectedTags.includes(tag.value)}
                style={{ color: tagColors[tag.value] }}
                onClick={() => handleTagClick(tag.value)}
              >
                {tag.label}
              </AtTag>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 酒店列表 */}
      <ScrollView className="hotel-list" scrollY>
        {loading ? (
          <View className="loading-container">
            <Text className="loading-text">加载中...</Text>
          </View>
        ) : hotels.length === 0 ? (
          <View className="empty-container">
            <Text className="empty-text">暂无符合条件的酒店</Text>
          </View>
        ) : (
          hotels.map((hotel) => (
            <View key={hotel.hotelId} className="hotel-card" onClick={() => navigateToDetail(hotel.hotelId)}>
              <View className="hotel-image-wrapper">
                <Image
                  className="hotel-image"
                  src={hotel.images[0] || 'https://via.placeholder.com/200x150?text=Hotel'}
                  mode="aspectFill"
                />
                {hotel.isDiscount && (
                  <View className="discount-badge">
                    <Text className="discount-text">{hotel.discountInfo}</Text>
                  </View>
                )}
              </View>
              <View className="hotel-info">
                <View className="hotel-header">
                  <Text className="hotel-name">{hotel.name}</Text>
                  <View className="star-rating">{renderStars(hotel.hotelRating || 0)}</View>
                </View>

                <View className="hotel-rating-row">
                  <View className="rating-badge">
                    <Text className="rating-score">{hotel.reviewScore || '4.5'}</Text>
                  </View>
                  <Text className="rating-text">超棒</Text>
                  <Text className="review-count">{hotel.reviewCount || 0}条点评</Text>
                  <Text className="collection-count">· {(hotel.reviewCount || 0) * 5}收藏</Text>
                </View>

                <View className="hotel-location">
                  <Text className="location-desc">{hotel.address}</Text>
                </View>

                <View className="hotel-tags">
                  {hotel.tags?.slice(0, 3).map((tag, index) => (
                    <AtTag key={index} className="hotel-tag" size="small" type="primary">
                      {tag}
                    </AtTag>
                  ))}
                </View>

                <View className="hotel-price-row">
                  <View className="price-info">
                    <Text className="price-symbol">¥</Text>
                    <Text className="price-value">{hotel.lowestPrice || hotel.price}</Text>
                    <Text className="price-start">起</Text>
                  </View>
                  {hotel.isDiscount && (
                    <AtTag className="promo-tag" size="small" type="warning">
                      钻石贵员价
                    </AtTag>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* 筛选抽屉 */}
      <View
        className={`filter-drawer-container ${isFilterDrawerOpen ? 'open' : ''}`}
        onClick={(e) => {
          // 点击背景关闭抽屉（如果点击的是背景而不是内容区域）
          if (e.target === e.currentTarget) {
            setIsFilterDrawerOpen(false);
          }
        }}
      >
        <View className="filter-drawer-content">
          <View className="drawer-header">
            <Text className="drawer-title">筛选条件</Text>
            <AtIcon
              value="close"
              size="20"
              color="#666"
              className="close-icon"
              onClick={() => setIsFilterDrawerOpen(false)}
            />
          </View>

          <View className="drawer-body">
            <View className="filter-list">
              {/* 价格范围 */}
              <View className="filter-item">
                <Text className="filter-title">价格范围</Text>
                <View className="price-range-inputs">
                  <View className="price-input-wrapper">
                    <Text className="price-symbol">¥</Text>
                    <AtSearchBar
                      value={filterState.priceRange.min}
                      onChange={(value) =>
                        setFilterState({ ...filterState, priceRange: { ...filterState.priceRange, min: value } })
                      }
                      placeholder="最低"
                      className="price-input"
                    />
                  </View>
                  <Text className="price-range-separator">-</Text>
                  <View className="price-input-wrapper">
                    <Text className="price-symbol">¥</Text>
                    <AtSearchBar
                      value={filterState.priceRange.max}
                      onChange={(value) =>
                        setFilterState({ ...filterState, priceRange: { ...filterState.priceRange, max: value } })
                      }
                      placeholder="最高"
                      className="price-input"
                    />
                  </View>
                </View>
              </View>

              {/* 星级 */}
              <View className="filter-item">
                <Text className="filter-title">星级</Text>
                <View className="price-range-inputs">
                  <View className="price-input-wrapper">
                    <AtSearchBar
                      value={filterState.starRange.min}
                      onChange={(value) =>
                        setFilterState({ ...filterState, starRange: { ...filterState.starRange, min: value } })
                      }
                      placeholder="最低"
                      className="price-input"
                    />
                  </View>
                  <Text className="price-range-separator">-</Text>
                  <View className="price-input-wrapper">
                    <AtSearchBar
                      value={filterState.starRange.max}
                      onChange={(value) =>
                        setFilterState({ ...filterState, starRange: { ...filterState.starRange, max: value } })
                      }
                      placeholder="最高"
                      className="price-input"
                    />
                  </View>
                </View>
              </View>

              {/* 评分 */}
              <View className="filter-item">
                <Text className="filter-title">评分</Text>
                <View className="price-range-inputs">
                  <View className="price-input-wrapper">
                    <AtSearchBar
                      value={filterState.ratingRange.min}
                      onChange={(value) =>
                        setFilterState({ ...filterState, ratingRange: { ...filterState.ratingRange, min: value } })
                      }
                      placeholder="最低"
                      className="price-input"
                    />
                  </View>
                  <Text className="price-range-separator">-</Text>
                  <View className="price-input-wrapper">
                    <AtSearchBar
                      value={filterState.ratingRange.max}
                      onChange={(value) =>
                        setFilterState({ ...filterState, ratingRange: { ...filterState.ratingRange, max: value } })
                      }
                      placeholder="最高"
                      className="price-input"
                    />
                  </View>
                </View>
              </View>

              {/* 是否优惠 */}
              <View className="filter-item">
                <Text className="filter-title">是否优惠</Text>
                <View className="discount-buttons">
                  <AtButton
                    type="primary"
                    size="small"
                    className={`discount-button ${filterState.hasDiscount === 'yes' ? 'selected' : ''}`}
                    onClick={() => setFilterState({ ...filterState, hasDiscount: 'yes' })}
                  >
                    有优惠
                  </AtButton>
                  <AtButton
                    type="primary"
                    size="small"
                    className={`discount-button ${filterState.hasDiscount === 'all' ? 'selected' : ''}`}
                    onClick={() => setFilterState({ ...filterState, hasDiscount: 'all' })}
                  >
                    全部
                  </AtButton>
                </View>
              </View>
            </View>
          </View>

          <View className="drawer-actions">
            <View className="button-wrapper">
              <View className="button secondary" onClick={handleResetFilter}>
                <Text className="button-text">重置</Text>
              </View>
              <View className="button primary" onClick={handleConfirmFilter}>
                <Text className="button-text">确定</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
