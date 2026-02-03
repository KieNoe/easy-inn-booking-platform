// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { loginUser, getUserProfile } from '@services/userService'
// import { User, LoginCredentials } from '@types/user'

// interface UserState {
//   currentUser: User | null
//   loading: boolean
//   error: string | null
// }

// const initialState: UserState = {
//   currentUser: null,
//   loading: false,
//   error: null,
// }

// export const login = createAsyncThunk(
//   'user/login',
//   async (credentials: LoginCredentials, { rejectWithValue }) => {
//     try {
//       const response = await loginUser(credentials)
//       localStorage.setItem('token', response.token)
//       return response.user
//     } catch (error: any) {
//       return rejectWithValue(error.message)
//     }
//   }
// )

// export const fetchUserProfile = createAsyncThunk(
//   'user/fetchProfile',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getUserProfile()
//       return response.data
//     } catch (error: any) {
//       return rejectWithValue(error.message)
//     }
//   }
// )

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.currentUser = null
//       localStorage.removeItem('token')
//     },
//     clearError: (state) => {
//       state.error = null
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false
//         state.currentUser = action.payload
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.currentUser = action.payload
//       })
//   },
// })

// export const { logout, clearError } = userSlice.actions
// export default userSlice.reducer
