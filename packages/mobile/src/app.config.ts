export default {
  pages: [
    'pages/index/index',
    'pages/search/index', // 添加搜索页面
    'pages/list/index',
    'pages/detail/index',
    'pages/profile/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '易宿',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#3cc51f',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/images/home.png',
        selectedIconPath: 'assets/images/home-active.png',
      },
      {
        pagePath: 'pages/search/index',
        text: '搜索',
        iconPath: 'assets/images/search.png',
        selectedIconPath: 'assets/images/search-active.png',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/images/profile.png',
        selectedIconPath: 'assets/images/profile-active.png',
      },
    ],
  },
};
