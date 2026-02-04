import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import './index.css';

export default function List() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  return (
    <View className="list">
      <Text>酒店列表页</Text>
      <Button
        onClick={() => {
          Taro.navigateTo({
            url: '/pages/detail/index',
          });
        }}
      >
        跳转到详情页
      </Button>
    </View>
  );
}
