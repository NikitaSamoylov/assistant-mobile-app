import { ReactNode } from 'react';
import { TextField } from '@/components/TextField';

export const PageSubtitle = ({ children }: { children: ReactNode }) => {
  return (
    <TextField variant="h2" color="main" style={{ margin: '25px 0 15px 0', lineHeight: '2.7rem' }}>
      {children}
    </TextField>
  )
};