import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      phone: string;
      userName: string;
    } & DefaultSession["user"];
  }
  interface User {
    userName?: string;
    phone?: string;
  }
}
