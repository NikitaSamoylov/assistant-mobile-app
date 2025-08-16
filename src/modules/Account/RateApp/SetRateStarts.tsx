'use client';

import React, { useState } from 'react';
import { IoIosStar } from "react-icons/io";

type TProps = {
  rate: string | null;
  isDisabled: boolean;
  setRate: (val: string) => void;
};

export const SetRateStars = ({ setRate, rate, isDisabled }: TProps) => {
  const [hover, setHover] = useState(0);

  const numericRate = rate !== null && Number(rate) || 0;

  return (
    <div style={{
      fontSize: '2rem',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '15px',
    }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => {
            if (isDisabled) return;
            setRate(String(star))
          }}
          onMouseEnter={() => {
            if (isDisabled) return;
            setHover(star);
          }}
          onMouseLeave={() => {
            if (isDisabled) return;
            setHover(0)
          }}
        >
          <IoIosStar
            style={{
              fontSize: '2.7rem',
              color: (hover || numericRate) >= star ? 'gold' : 'gray',
              marginRight: '8px',
            }}
          />
        </button>
      ))}
    </div>
  );
};