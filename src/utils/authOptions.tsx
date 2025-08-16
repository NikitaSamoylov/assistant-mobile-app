import { connectDB } from "@/lib/connectDataBase";
import User from "@/lib/models/User";
import { Pathes } from "@/lib/types/pathes";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email, Phone and Code',
      credentials: {
        email: { label: 'Email', type: 'text' },
        phone: { label: 'Phone', type: 'text' },
        verificationCode: { label: 'Verification Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        await connectDB();

        const { email, phone, verificationCode } = credentials;

        let user = null;

        if (email && verificationCode) {
          user = await User.findOne({ email });
        }

        if (!user && phone && verificationCode) {
          user = await User.findOne({ phone });
        }

        if (!user) {
          throw new Error('Пользователь не найден');
        }

        if (
          user.verificationCode !== verificationCode ||
          new Date() > user.verificationCodeExpires
        ) {
          throw new Error('Неверный код или срок его действия истёк');
        }

        user.emailVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;

        await user.save();

        return {
          id: user._id,
          email: user.email,
          phone: user.phone,
          userName: user.userName,
        };
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.phone = user.phone;
        token.userName = user.userName;
      };
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.phone = token.phone as string;
        session.user.userName = token.userName as string;
      }
      return session;
    }
  },
  pages: {
    signIn: Pathes.AUTH,
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
