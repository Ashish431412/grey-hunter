import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import toolsReducer from './slices/toolsSlice';
import projectsReducer from './slices/projectsSlice';
import settingsReducer from './slices/settingsSlice';
import syncReducer from './slices/syncSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  tools: toolsReducer,
  projects: projectsReducer,
  settings: settingsReducer,
  sync: syncReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Useful when dealing with dates or navigation state
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
