import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
};

interface TimerState {
  theme: ThemeMode;
};

const initialState: TimerState = {
  theme: ThemeMode.LIGHT,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;