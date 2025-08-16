import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  pullFromIDB: boolean;
};

const initialState: IInitialState = {
  pullFromIDB: false,
};

const updateExistingProductsSlice = createSlice({
  name: 'updateExistingProductsSlice',
  initialState,
  reducers: {
    setPullFromIDB: (state, action: PayloadAction<boolean>) => {
      state.pullFromIDB = action.payload;
    },
  },
});

export const {
  setPullFromIDB,
} = updateExistingProductsSlice.actions;
export default updateExistingProductsSlice.reducer;