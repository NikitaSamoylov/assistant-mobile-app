import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  isCheckBackup: boolean | null;
};

const initialState: IInitialState = {
  isCheckBackup: null,
};

const isCheckingBackupSlice = createSlice({
  name: 'isCheckBackup',
  initialState,
  reducers: {
    setIsCheckBackup: (state, action: PayloadAction<boolean>) => {
      state.isCheckBackup = action.payload;
    },
  },
});

export const { setIsCheckBackup } = isCheckingBackupSlice.actions;
export default isCheckingBackupSlice.reducer;