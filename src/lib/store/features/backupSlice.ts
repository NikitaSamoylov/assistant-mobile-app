import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  backup: boolean | null;
};

const initialState: IInitialState = {
  backup: null,
};

const backUpSlice = createSlice({
  name: 'backup',
  initialState,
  reducers: {
    setBackup: (state, action: PayloadAction<boolean>) => {
      state.backup = action.payload;
    },
  },
});

export const { setBackup } = backUpSlice.actions;
export default backUpSlice.reducer;