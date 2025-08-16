import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  aiRequestCount: {
    count: number;
    date: string;
  };
};

const initialState: IInitialState = {
  aiRequestCount: { count: 0, date: '' },
};

const aiRequestCountSlice = createSlice({
  name: 'aiRequestCount',
  initialState,
  reducers: {
    setAiRequestCount: (state, action: PayloadAction<{ count: number, date: string }>) => {
      state.aiRequestCount = action.payload;
    },
  },
});

export const { setAiRequestCount } = aiRequestCountSlice.actions;
export default aiRequestCountSlice.reducer;