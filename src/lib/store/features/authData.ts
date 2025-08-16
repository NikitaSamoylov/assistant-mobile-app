import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAuthData {
  userName: string;
  email?: string;
  phone?: string;
};

interface IInitialState {
  authData: IAuthData | null;
};

const initialState: IInitialState = {
  authData: null,
};

const authDataSlice = createSlice({
  name: 'authData',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<IAuthData>) => {
      state.authData = action.payload;
    },
    removeAuthData: () => {
      return initialState;
    },
  },
});

export const { setAuthData, removeAuthData } = authDataSlice.actions;
export default authDataSlice.reducer;