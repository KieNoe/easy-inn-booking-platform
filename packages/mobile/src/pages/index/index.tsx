import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import './index.css';

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  return (
    <View className="index">
      <Text>酒店查询页</Text>
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
