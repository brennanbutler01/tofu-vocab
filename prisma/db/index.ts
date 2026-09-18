import type { PrismaClient } from '@prisma/client';

declare global {
	var prisma: PrismaClient;
}

let prisma: PrismaClient;

if (typeof window === 'undefined') {
	const {
		PrismaClient,
	}: typeof import('@prisma/client') = require('@prisma/client');
	const {
		PrismaPg,
	}: typeof import('@prisma/adapter-pg') = require('@prisma/adapter-pg');
	if (process.env.NODE_ENV === 'production') {
		prisma = new PrismaClient({
			adapter: new PrismaPg({
				connectionString: process.env.DATABASE_URL,
			}),
		});
	} else {
		if (!global.prisma) {
			global.prisma = new PrismaClient({
				adapter: new PrismaPg({
					connectionString: process.env.DATABASE_URL,
				}),
			});
		}

		prisma = global.prisma;
	}
}

//@ts-ignore
export default prisma;
