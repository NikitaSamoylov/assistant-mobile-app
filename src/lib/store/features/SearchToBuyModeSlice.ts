import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  isSearchToBuy: boolean;
};

const initialState: IInitialState = {
  isSearchToBuy: false,
};

const searchToBuyModeSlice = createSlice({
  name: 'searchToBuyMode',
  initialState,
  reducers: {
    setToBuySearchMode: (state, action: PayloadAction<boolean>) => {
      state.isSearchToBuy = action.payload;
    },
  },
});

export const { setToBuySearchMode } = searchToBuyModeSlice.actions;
export default searchToBuyModeSlice.reducer;