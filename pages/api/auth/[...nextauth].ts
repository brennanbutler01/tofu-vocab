import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from 'prisma/db/index';
import { User } from '@prisma/client';
import { visitorEnabled } from 'server/visitor';

export const authOptions: NextAuthOptions = {
	secret: process.env.SECRET,
	adapter: PrismaAdapter(prisma),
	session: { maxAge: 3600, updateAge: 3600 },
	providers: visitorEnabled
		? []
		: [
				GoogleProvider({
					clientId: process.env.GOOGLE_ID as string,
					clientSecret: process.env.GOOGLE_SECRET as string,
				}),
			],
	callbacks: {
		session({ session, user }) {
			return { ...session, user: { ...(user as User) } };
		},
	},
	pages: {
		signIn: '/auth/signin',
		newUser: '/auth/newUser',
	},
};

export default NextAuth(authOptions);
