export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// export const formatTime = (seconds: number): string => {
//   const hrs = Math.floor(seconds / 360);
//   const mins = Math.floor((seconds % 360) / 60);
//   const secs = seconds % 60;

//   const pad = (num: number) => String(num).padStart(2, '');

//   return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
// };