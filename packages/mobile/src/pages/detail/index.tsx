import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import './index.css';

export default function Detail() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  return (
    <View className="detail">
      <Text>酒店详情页</Text>
      <Button
        onClick={() => {
          Taro.navigateTo({
            url: '/pages/list/index',
          });
        }}
      >
        跳转到列表页
      </Button>
    </View>
  );
}
