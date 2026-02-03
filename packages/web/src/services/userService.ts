// import api from '@utils/api'
// import { User, LoginCredentials, RegisterData } from '@types/user'

// export interface ApiResponse<T> {
//   code: number
//   message: string
//   data: T
// }

// export const loginUser = async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
//   const response = await api.post('/auth/login', credentials)
//   return response
// }

// export const registerUser = async (data: RegisterData): Promise<ApiResponse<User>> => {
//   const response = await api.post('/auth/register', data)
//   return response
// }

// export const getUserProfile = async (): Promise<ApiResponse<User>> => {
//   const response = await api.get('/user/profile')
//   return response
// }

// export const updateUserProfile = async (data: Partial<User>): Promise<ApiResponse<User>> => {
//   const response = await api.put('/user/profile', data)
//   return response
// }
