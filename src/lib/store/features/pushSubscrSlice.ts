import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  isPushSubscr: boolean | null;
};

const initialState: IInitialState = {
  isPushSubscr: false,
};

const isPushSubscrSlice = createSlice({
  name: 'isPushSubscr',
  initialState,
  reducers: {
    setPushSubscr: (state, action: PayloadAction<boolean>) => {
      state.isPushSubscr = action.payload;
    },
    removePushSubscr: (state) => {
      state.isPushSubscr = initialState.isPushSubscr;
    }
  },
});

export const { setPushSubscr, removePushSubscr } = isPushSubscrSlice.actions;
export default isPushSubscrSlice.reducer;