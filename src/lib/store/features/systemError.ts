import { createSlice } from '@reduxjs/toolkit';

interface IInitialState {
  systemError: boolean;
};

const initialState: IInitialState = {
  systemError: false,
};

const systemErrorSlice = createSlice({
  name: 'systemError',
  initialState,
  reducers: {
    setSystemError: (state) => {
      state.systemError = true;
    },
    clearSystemError: (state) => {
      state.systemError = false;
    },
  },
});

export const { setSystemError, clearSystemError } = systemErrorSlice.actions;
export default systemErrorSlice.reducer;