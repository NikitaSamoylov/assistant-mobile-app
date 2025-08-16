/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { startTimer, stopTimer, updateTimeLeft } from '@/lib/store/features/timers/timerSlice';
import { TextField } from '../TextField';
import { formatTime } from '@/utils/formatTimerTime';
import { TTextFieldColors } from '@/lib/types/textField';

interface CountdownTimerProps {
  initialMinutes: number;
  onTimerEnd?: (val: boolean) => void;
  launchTimer: boolean;
  textColor?: TTextFieldColors;
}

export const CountDownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes,
  onTimerEnd,
  launchTimer,
  textColor = 'caption',
}) => {
  const dispatch = useDispatch();
  const { endTime, isActive, timeLeft } = useSelector((state: RootState) => state.countdown);

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const currentTime = new Date().getTime();
      const remaining = Math.max(0, Math.floor((endTime - currentTime) / 1000));
      dispatch(updateTimeLeft(remaining))

      if (remaining <= 0) {
        handleTimerEnd();
      }
    };

    calculateTimeLeft();

    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const handleTimerEnd = () => {
    dispatch(stopTimer());
    if (onTimerEnd) onTimerEnd(false);
  };

  useEffect(() => {
    if (launchTimer && !isActive) {
      const endTime = new Date().getTime() + initialMinutes * 60 * 1000;
      dispatch(startTimer(endTime));
    }
  }, [launchTimer, initialMinutes, dispatch, isActive]);

  return (
    <div className="countdown-timer">
      {isActive && endTime ? (
        <div className="time-display" style={{ textAlign: 'center' }}>
          <TextField variant="span" color={textColor}>
            {formatTime(timeLeft)}
          </TextField>
        </div>
      ) : null}
    </div>
  );
};