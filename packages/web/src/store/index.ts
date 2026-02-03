// import { configureStore } from '@reduxjs/toolkit'
// import { setupListeners } from '@reduxjs/toolkit/query'
// import { userApi } from '@services/userApi'
// import userReducer from './slices/userSlice'
// import merchantReducer from './slices/merchantSlice'
// import cartReducer from './slices/cartSlice'

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//     merchant: merchantReducer,
//     cart: cartReducer,
//     [userApi.reducerPath]: userApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(userApi.middleware),
// })

// setupListeners(store.dispatch)

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

// // hooks
// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
// export const useAppDispatch = () => useDispatch<AppDispatch>()
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
