// 全局类型定义
export interface BaseResponse<T> {
  code: number
  message: string
  data: T
}

export interface User {
  id: number
  name: string
  email: string
}