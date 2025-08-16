import { TUserAuth, TUserAuthPhone } from '@/lib/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  userSession: TUserAuth | TUserAuthPhone | null;
};

const initialState: IInitialState = {
  userSession: null,
};

const sessionSlice = createSlice({
  name: 'userSession',
  initialState,
  reducers: {
    setUserSession: (state, action: PayloadAction<TUserAuth | TUserAuthPhone>) => {
      state.userSession = action.payload;
    },
    removeUserSession: (state) => {
      state.userSession = null;
    },
  },
});

export const { setUserSession, removeUserSession } = sessionSlice.actions;
export default sessionSlice.reducer;