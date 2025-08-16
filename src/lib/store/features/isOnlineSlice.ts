import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  isUserOnline: boolean | null;
};

const initialState: IInitialState = {
  isUserOnline: null,
};

const isUserOnlineSlice = createSlice({
  name: 'isUserOnline',
  initialState,
  reducers: {
    setIsUserOnline: (state, action: PayloadAction<boolean>) => {
      state.isUserOnline = action.payload;
    },
  },
});

export const { setIsUserOnline } = isUserOnlineSlice.actions;
export default isUserOnlineSlice.reducer;