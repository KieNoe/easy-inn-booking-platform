// export default [
//   {
//     url: '/api/todos',
//     method: 'get', // GET请求
//     response: () => ({...})
//   },
//   {
//     url: '/api/todos',
//     method: 'post', // POST请求
//     response: (req) => {
//       const { body } = req // 获取请求体
//       return {...}
//     }
//   },
//   {
//     url: '/api/todos/:id',
//     method: 'put', // PUT请求
//     response: (req) => {
//       const { id } = req.params // 获取路由参数
//       return {...}
//     }
//   }
// ]
let mockHotelId = 3001;
const mockHotels: any[] = [];

export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '登录成功',
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          userInfo: {
            userId: 1,
            username: 'admin',
            nickname: '管理员',
            email: 'admin@example.com',
            phone: '13800138000',
            avatar: null,
            role: 'super_admin',
            status: 'active',
            createTime: '2026-02-05T10:00:00.000Z',
          },
          expireTime: 7200,
        },
      };
    },
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          userId: 1,
          username: 'admin',
          nickname: '管理员',
          email: 'admin@example.com',
          phone: '13800138000',
          avatar: null,
          role: 'super_admin',
          status: 'active',
          createTime: '2026-02-05T10:00:00.000Z',
        },
      };
    },
  },
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '退出登录成功',
        data: null,
      };
    },
  },
  {
    url: '/api/user/register',
    method: 'post',
    response: (req) => {
      const { body } = req;
      const { username, email, role = 'user' } = body;
      return {
        code: 200,
        message: '注册成功',
        data: {
          userId: 1002,
          username: username,
          email: email,
          role: role,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
      };
    },
  },
  {
    url: '/api/user/forgot-password/send-code',
    method: 'post',
    response: (req) => {
      const { body } = req;
      const { email } = body;
      return {
        code: 200,
        message: '验证码已发送至邮箱',
        data: {
          email: email,
          expireTime: 300,
        },
      };
    },
  },
  {
    url: '/api/user/reset-password',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '密码重置成功',
        data: null,
      };
    },
  },
  {
    url: '/api/hotels',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          content: mockHotels,
          totalElements: mockHotels.length,
        },
      };
    },
  },
  {
    url: '/api/hotels',
    method: 'post',
    response: (req) => {
      const { body } = req;
      const created = {
        ...body,
        hotelId: mockHotelId++,
        status: body?.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockHotels.unshift(created);
      return {
        code: 200,
        message: '创建成功',
        data: created,
      };
    },
  },
  {
    url: '/api/hotels/:id',
    method: 'put',
    response: (req) => {
      const { id } = req.params;
      const { body } = req;
      const index = mockHotels.findIndex((item) => String(item.hotelId) === String(id));
      const updated = {
        ...(index >= 0 ? mockHotels[index] : {}),
        ...body,
        hotelId: Number(id),
        updatedAt: new Date().toISOString(),
      };
      if (index >= 0) {
        mockHotels[index] = updated;
      } else {
        mockHotels.unshift(updated);
      }
      return {
        code: 200,
        message: '更新成功',
        data: updated,
      };
    },
  },
  {
    url: '/api/hotels/:id/status',
    method: 'put',
    response: (req) => {
      const { id } = req.params;
      const { body } = req;
      const index = mockHotels.findIndex((item) => String(item.hotelId) === String(id));
      const updated = {
        ...(index >= 0 ? mockHotels[index] : {}),
        status: body?.status || 'pending',
        hotelId: Number(id),
        updatedAt: new Date().toISOString(),
      };
      if (index >= 0) {
        mockHotels[index] = updated;
      } else {
        mockHotels.unshift(updated);
      }
      return {
        code: 200,
        message: '状态更新成功',
        data: updated,
      };
    },
  },
];
