import { TProduct } from '@/lib/types/product';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  searchValue: TProduct[];
};

const initialState: IInitialState = {
  searchValue: [],
};

const existingProductsSearchSlice = createSlice({
  name: 'existingProductsSearch',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<TProduct[]>) => {
      state.searchValue = action.payload;
    },
  },
});

export const { setValue } = existingProductsSearchSlice.actions;
export default existingProductsSearchSlice.reducer;