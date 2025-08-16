import { ReactNode } from "react";
import { TextField } from "@/components/TextField"

type TProps = {
  children: ReactNode;
  tillUlSpace?: boolean;
};

export const Paragraph = ({ children, tillUlSpace = false }: TProps) => {
  return (
    <TextField variant="p" color="main" style={{ fontSize: '1.9rem', marginBottom: tillUlSpace ? '10px' : '15px' }}>
      {children}
    </TextField>
  )
};