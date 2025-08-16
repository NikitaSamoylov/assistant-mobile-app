import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimerState {
  endTime: number | null;
  isActive: boolean;
  timeLeft: number;
}

const initialState: TimerState = {
  endTime: null,
  isActive: false,
  timeLeft: 0,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state, action: PayloadAction<number>) => {
      state.endTime = action.payload;
      state.isActive = true;
    },
    stopTimer: (state) => {
      state.endTime = null;
      state.isActive = false;
    },
    updateTimeLeft: (state, action: PayloadAction<number>) => {
      state.timeLeft = action.payload;
    },
  },
});

export const { startTimer, stopTimer, updateTimeLeft } = timerSlice.actions;
export default timerSlice.reducer;