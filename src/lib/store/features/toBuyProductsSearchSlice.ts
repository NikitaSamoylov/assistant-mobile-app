import { TBuyProducts } from '@/lib/types/product';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  toBuySearchValue: TBuyProducts[];
};

const initialState: IInitialState = {
  toBuySearchValue: [],
};

const toBuyProductsSearchSlice = createSlice({
  name: 'toBuySearchValue',
  initialState,
  reducers: {
    setToBuyValue: (state, action: PayloadAction<TBuyProducts[]>) => {
      state.toBuySearchValue = action.payload;
    },
  },
});

export const { setToBuyValue } = toBuyProductsSearchSlice.actions;
export default toBuyProductsSearchSlice.reducer;