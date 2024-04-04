import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';//
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web//
import authReducer from './authSlice';
import leaderboardReducer from './leaderboardSlice';

//
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     leaderboard: leaderboardReducer,
//   },
// });

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    leaderboard: leaderboardReducer,
  },
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;