import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  showNoInternetMsg: boolean | null;
};

const initialState: IInitialState = {
  showNoInternetMsg: null,
};

const noInternetMsgSlice = createSlice({
  name: 'noInternetMsg',
  initialState,
  reducers: {
    setNoInternetMsg: (state, action: PayloadAction<boolean>) => {
      state.showNoInternetMsg = action.payload;
    },
  },
});

export const { setNoInternetMsg } = noInternetMsgSlice.actions;
export default noInternetMsgSlice.reducer;