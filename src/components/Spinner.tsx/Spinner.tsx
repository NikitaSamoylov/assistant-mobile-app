import { PRELOADER_DEFAULT_SIZE } from '@/lib/consts/consts';
import React from 'react';

const colors = {
  white: '#fff',
  black: '#000',
  default: '#bfbfc1',
};

type TSpinnerProps = {
  size?: number;
  color?: string;
};

export const Spinner = ({ size = PRELOADER_DEFAULT_SIZE, color = 'default' }: TSpinnerProps) => {
  const proportion = 7.5;
  const borderSize = size / proportion;

  return (
    <div style={{
      display: 'inline-block',
      width: `${size}px`,
      height: `${size}px`,
      border: `${borderSize}px solid ${colors[color as keyof typeof colors]}`,
      borderTop: `${borderSize}px solid transparent`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  );
};

const styleSheet = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = styleSheet;
  document.head.appendChild(styleTag);
};