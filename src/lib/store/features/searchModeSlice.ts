import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  isSearch: boolean;
};

const initialState: IInitialState = {
  isSearch: false,
};

const searchModeSlice = createSlice({
  name: 'searchModeSlice',
  initialState,
  reducers: {
    setSearchMode: (state, action: PayloadAction<boolean>) => {
      state.isSearch = action.payload;
    },
  },
});

export const { setSearchMode } = searchModeSlice.actions;
export default searchModeSlice.reducer;