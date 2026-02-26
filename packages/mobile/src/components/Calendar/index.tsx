import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import './index.css';

interface CalendarDay {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDisabled: boolean;
  dateString: string;
  isWeekend: boolean;
}

interface CalendarProps {
  // startDate?: Date;
  // endDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  // onDateSelect?: (startDate: Date, endDate: Date | null) => void;
  mode?: 'single' | 'range'; // 单选或范围选择
}

const Calendar: Taro.FC<CalendarProps> = ({
  startDate,
  endDate,
  minDate = new Date(),
  maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 默认一年后
  onDateSelect,
  mode = 'range',
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(startDate || new Date());
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(startDate || null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(endDate || null);

  // 生成日历天数数据
  const generateCalendarDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // 获取当月第一天和最后一天
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // 获取当月第一天是星期几
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // 获取当月天数
    const daysInMonth = lastDayOfMonth.getDate();

    // 计算需要显示的总天数（包括上个月和下个月的部分天数）
    const totalDays = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

    const calendarDays: CalendarDay[] = [];

    // 添加上个月的天数
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      calendarDays.push(createCalendarDay(day, false));
    }

    // 添加当月的天数
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      calendarDays.push(createCalendarDay(day, true));
    }

    // 添加下个月的天数
    const remainingDays = totalDays - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(year, month + 1, i);
      calendarDays.push(createCalendarDay(day, false));
    }

    return calendarDays;
  };

  const createCalendarDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    // 检查日期是否在允许范围内
    const isDisabled = date < minDate || date > maxDate;

    // 检查是否是周末
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    return {
      date,
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      isCurrentMonth,
      isToday,
      isDisabled,
      isWeekend,
      dateString: formatDate(date),
    };
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // 检查日期是否被选中
  const isDateSelected = (day: CalendarDay): boolean => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const dateStr = formatDate(day.date);
    const startStr = formatDate(selectedStartDate);
    const endStr = formatDate(selectedEndDate);
    return dateStr >= startStr && dateStr <= endStr;
  };

  // 检查是否是选中的起始日期
  const isStartDate = (day: CalendarDay): boolean => {
    return selectedStartDate && formatDate(day.date) === formatDate(selectedStartDate);
  };

  // 检查是否是选中的结束日期
  const isEndDate = (day: CalendarDay): boolean => {
    return selectedEndDate && formatDate(day.date) === formatDate(selectedEndDate);
  };

  // 检查是否在选择范围内（但不是起点或终点）
  const isInRange = (day: CalendarDay): boolean => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const dateStr = formatDate(day.date);
    const startStr = formatDate(selectedStartDate);
    const endStr = formatDate(selectedEndDate);
    return dateStr > startStr && dateStr < endStr;
  };

  // 处理日期点击
  const handleDateClick = (day: CalendarDay) => {
    if (day.isDisabled) return;

    if (mode === 'single') {
      // 单选模式
      if (onDateSelect) {
        onDateSelect(day.date, null);
      }
    } else {
      // 范围选择模式
      if (
        !selectedStartDate ||
        (selectedStartDate && selectedEndDate && formatDate(day.date) !== formatDate(selectedStartDate))
      ) {
        // 如果还没有开始日期，或者已经有了结束日期且点击的不是起始日期，则设置为新的开始日期
        setSelectedStartDate(day.date);
        setSelectedEndDate(null);
        if (onDateSelect) {
          onDateSelect(day.date, null);
        }
      } else {
        // 如果已经有了开始日期，但还没有结束日期
        if (day.date >= selectedStartDate) {
          setSelectedEndDate(day.date);
          if (onDateSelect) {
            onDateSelect(selectedStartDate, day.date);
          }
        } else {
          // 如果点击的日期早于开始日期，则交换
          setSelectedEndDate(selectedStartDate);
          setSelectedStartDate(day.date);
          if (onDateSelect) {
            onDateSelect(day.date, selectedStartDate);
          }
        }
      }
    }
  };

  // 切换月份
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // 获取月份名称
  const getMonthName = (month: number): string => {
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return months[month];
  };

  // 生成日历数据
  useEffect(() => {
    const generatedDays = generateCalendarDays(currentDate);
    setDays(generatedDays);
  }, [currentDate, minDate, maxDate, selectedStartDate, selectedEndDate]);

  return (
    <View className="calendar-container">
      {/* 月份导航 */}
      <View className="calendar-header">
        <Text className="prev-month-btn" onClick={goToPreviousMonth}>
          &lt;
        </Text>
        <Text className="current-month">
          {currentDate.getFullYear()}年 {getMonthName(currentDate.getMonth())}
        </Text>
        <Text className="next-month-btn" onClick={goToNextMonth}>
          &gt;
        </Text>
      </View>

      {/* 星期标题 - 携程风格 */}
      <View className="weekdays-header">
        {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
          <Text key={index} className={`weekday-title ${index === 0 || index === 6 ? 'weekend' : ''}`}>
            {day}
          </Text>
        ))}
      </View>

      {/* 日期网格 - 携程风格 */}
      <ScrollView scrollY className="calendar-grid">
        <View className="calendar-month">
          {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => {
            const weekDays = days.slice(weekIndex * 7, (weekIndex + 1) * 7);
            return (
              <View key={weekIndex} className="calendar-week">
                {weekDays.map((day, dayIndex) => {
                  const isSelected = isDateSelected(day);
                  const isStart = isStartDate(day);
                  const isEnd = isEndDate(day);
                  const inRange = isInRange(day);

                  return (
                    <View
                      key={dayIndex}
                      className={`calendar-day-cell ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${
                        day.isToday ? 'today' : ''
                      } ${isSelected ? 'selected' : ''} ${isStart ? 'start-date' : ''} ${isEnd ? 'end-date' : ''} ${
                        inRange ? 'in-range' : ''
                      } ${day.isDisabled ? 'disabled' : ''} ${day.isWeekend ? 'weekend' : ''}`}
                      onClick={() => handleDateClick(day)}
                    >
                      <View className="day-wrapper">
                        <Text className="day-number">{day.day}</Text>
                        {day.isToday && <Text className="today-label">今</Text>}
                      </View>

                      {/* 选中日期的背景色 */}
                      {(isSelected || isStart || isEnd) && (
                        <View className={`selected-bg ${isStart ? 'start' : isEnd ? 'end' : 'range'}`}></View>
                      )}

                      {/* 范围选择的连接线 */}
                      {inRange && <View className="range-connector"></View>}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Calendar;
