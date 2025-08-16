import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from 'redux-persist';
import systemErrorSlice from './features/systemError';
import verifyBtnSlice from './features/verifyBtnSlice';
import timerSlice from './features/timers/timerSlice';
import themeSlice from './features/themeSlice';
import sessionSlice from './features/sessionSlice';
import updateExistingProductsSlice from './features/updateExistingProductsSlice';
import isUserOnlineSlice from './features/isOnlineSlice';
import isGlobalSyncSlice from './features/globalSyncSlice';
import searchModeSlice from './features/searchModeSlice';
import existingProductsSearchSlice from './features/existingProductsSearchSlice';
import searchToBuyModeSlice from './features/SearchToBuyModeSlice';
import toBuyProductsSearchSlice from './features/toBuyProductsSearchSlice';
import isPushSubscrSlice from './features/pushSubscrSlice';
import aiRequestCountSlice from './features/aiRequestsCountSlice';
import backUpSlice from './features/backupSlice';
import noInternetMsgSlice from './features/noInternetSlice';
import authDataSlice from './features/authData';
import isCheckingBackupSlice from './features/isCheckingBackupSlice';
import addProductSlice from './features/addProductSlice';

const rootReducer = combineReducers({
  systemError: systemErrorSlice,
  verifyBtn: verifyBtnSlice,
  countdown: timerSlice,
  theme: themeSlice,
  userSession: sessionSlice,
  updateExistingProducts: updateExistingProductsSlice,
  isUserOnline: isUserOnlineSlice,
  isGlobalSync: isGlobalSyncSlice,
  isSearch: searchModeSlice,
  existingProductsSearch: existingProductsSearchSlice,
  isSearchToBuy: searchToBuyModeSlice,
  toBuyProductsSearch: toBuyProductsSearchSlice,
  isPushSubscr: isPushSubscrSlice,
  aiRequestCountSlice: aiRequestCountSlice,
  backup: backUpSlice,
  showNoInternetMessage: noInternetMsgSlice,
  authData: authDataSlice,
  isCheckBackup: isCheckingBackupSlice,
  addProduct: addProductSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    'productsList',
    'revalidateTag',
    'isSearch',
    'existingProductsSearch',
    'searchProductsToBuyModeSlice',
    'isSearchToBuy',
    'toBuyProductsSearch',
    'isPushSubscr',
    'backup',
    'showNoInternetMessage',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;