import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  isGlobalSync: boolean | null;
};

const initialState: IInitialState = {
  isGlobalSync: null,
};

const isGlobalSyncSlice = createSlice({
  name: 'isGlobalSync',
  initialState,
  reducers: {
    setIsGlobalSync: (state, action: PayloadAction<boolean>) => {
      state.isGlobalSync = action.payload;
    },
  },
});

export const { setIsGlobalSync } = isGlobalSyncSlice.actions;
export default isGlobalSyncSlice.reducer;