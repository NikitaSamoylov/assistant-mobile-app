import { createSlice } from '@reduxjs/toolkit';

interface IInitialState {
  isVerifyBtnDisabled: boolean;
};

const initialState: IInitialState = {
  isVerifyBtnDisabled: false,
};

const verifyBtnSlice = createSlice({
  name: 'verifyBtn',
  initialState,
  reducers: {
    setVerifyBtnDisabled: (state) => {
      state.isVerifyBtnDisabled = true;
    },
    setVerifyBtnActive: (state) => {
      state.isVerifyBtnDisabled = false;
    },
  },
});

export const { setVerifyBtnDisabled, setVerifyBtnActive } = verifyBtnSlice.actions;
export default verifyBtnSlice.reducer;