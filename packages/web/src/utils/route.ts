import { useNavigate } from 'react-router-dom';

// 定义路由路径常量
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  HOTELS: '/hotels',
  BOOKINGS: '/bookings',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  NOT_FOUND: '*',
} as const;

// 路由跳转钩子
export const useRouter = () => {
  const navigate = useNavigate();

  const goToHome = () => navigate(ROUTES.HOME);
  const goToAbout = () => navigate(ROUTES.ABOUT);
  const goToHotels = () => navigate(ROUTES.HOTELS);
  const goToBookings = () => navigate(ROUTES.BOOKINGS);
  const goToProfile = () => navigate(ROUTES.PROFILE);
  const goToLogin = () => navigate(ROUTES.LOGIN);
  const goToRegister = () => navigate(ROUTES.REGISTER);

  // 带参数跳转
  const goToHotelDetail = (id: string | number) => navigate(`/hotels/${id}`);
  const goToBookingDetail = (id: string | number) => navigate(`/bookings/${id}`);

  // 返回上一页
  const goBack = () => navigate(-1);

  return {
    navigate,
    goToHome,
    goToAbout,
    goToHotels,
    goToBookings,
    goToProfile,
    goToLogin,
    goToRegister,
    goToHotelDetail,
    goToBookingDetail,
    goBack,
  };
};

// 页面初始化工具函数
export const initializePage = (title: string) => {
  document.title = title;
  window.scrollTo(0, 0); // 滚动到顶部
};

// 路由守卫辅助函数
export const isAuthenticated = (): boolean => {
  // 检查用户是否已认证
  const token = localStorage.getItem('auth_token');
  return !!token;
};

export const requireAuth = (next: string = '/login') => {
  if (!isAuthenticated()) {
    window.location.href = next;
  }
};