import type { Metadata } from "next";
import { AuthHeader } from "./AuthHeader";
import NextLink from 'next/link';
import { TextField } from "@/components/TextField";
import { Pathes } from "@/lib/types/pathes";
import { SwitchTheme } from "@/components/SwitchTheme";

export const metadata: Metadata = {
  title: "Мой дворецкий",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div style={{ padding: '15px', textAlign: 'center' }}>
        <SwitchTheme />
      </div>
      <main style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -30%)',
        width: '300px',
      }}>
        <AuthHeader />
        {children}
      </main>
      <NextLink
        href={Pathes.SUPPORT}
        style={{
          position: 'absolute',
          bottom: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '15px',
        }}
      >
        <TextField color="caption" variant="span">
          написать в поддержку
        </TextField>
      </NextLink>
      <TextField
        color="caption"
        variant="span"
        style={{
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        версия 2.11.0
      </TextField>
    </div>
  )
}
