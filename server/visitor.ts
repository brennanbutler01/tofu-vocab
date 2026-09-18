import { randomBytes, randomUUID } from 'node:crypto';
import type { NextApiHandler, NextApiRequest } from 'next';
import prisma from 'prisma/db/index';
import { deleteOwnedUser } from 'server/deleteOwnedUser';

export const visitorEnabled = process.env.VISITOR_DEMO === 'true';
export const visitorCookieName = process.env.NEXTAUTH_URL?.startsWith('https:')
	? '__Secure-next-auth.session-token'
	: 'next-auth.session-token';
const lifetime = 60 * 60 * 1000;

export function isSameOrigin(req: NextApiRequest) {
	return (
		Boolean(process.env.NEXTAUTH_URL) &&
		req.headers.origin === new URL(process.env.NEXTAUTH_URL!).origin
	);
}

export function visitorCookie(token: string, reset = false) {
	return `${visitorCookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${reset ? 0 : 3600}${visitorCookieName.startsWith('__Secure-') ? '; Secure' : ''}`;
}

export async function findVisitor(req: NextApiRequest) {
	const token = req.cookies[visitorCookieName];
	if (!token) return null;
	const session = await prisma.session.findUnique({
		where: { sessionToken: token },
		include: { user: { include: { demoVisit: true } } },
	});
	const visit = session?.user.demoVisit;
	return session &&
		visit &&
		visit.expiresAt > new Date() &&
		session.expires > new Date()
		? session
		: null;
}

export async function createVisitor() {
	return prisma.$transaction(
		async tx => {
			// Serialize capacity checks across concurrent serverless instances.
			await tx.$executeRaw`SELECT pg_advisory_xact_lock(51925192)`;
			const expired = await tx.demoVisit.findMany({
				where: { expiresAt: { lte: new Date() } },
				take: 100,
			});
			for (const visit of expired)
				await deleteOwnedUser(tx, visit.userId);
			if ((await tx.demoVisit.count()) >= 100) return null;
			const userId = 'visitor-' + randomUUID();
			const token = randomBytes(32).toString('hex');
			const expiresAt = new Date(Date.now() + lifetime);
			await tx.user.create({
				data: {
					id: userId,
					name: 'Demo learner',
					email: userId + '@example.invalid',
					boxes: {
						create: [0, 1, 2, 3, 4].map(boxNumber => ({
							boxNumber,
						})),
					},
					sessions: {
						create: { sessionToken: token, expires: expiresAt },
					},
					demoVisit: { create: { expiresAt } },
				},
			});
			const box = await tx.leitnerBox.findUniqueOrThrow({
				where: { userId_boxNumber: { userId, boxNumber: 0 } },
			});
			await tx.flashcard.createMany({
				data: [
					{
						userId,
						boxId: box.id,
						front: ['hello'],
						back: ['xin chào'],
					},
					{
						userId,
						boxId: box.id,
						front: ['thank you'],
						back: ['cảm ơn'],
					},
					{ userId, boxId: box.id, front: ['water'], back: ['nước'] },
				],
			});
			return { userId, token, expiresAt };
		},
		{ timeout: 15000 },
	);
}

export function withVisitorGuard(handler: NextApiHandler): NextApiHandler {
	return async (req, res) => {
		if (!visitorEnabled) {
			await handler(req, res);
			return;
		}
		res.setHeader('Cache-Control', 'no-store');
		if (!['GET', 'HEAD'].includes(req.method || '') && !isSameOrigin(req))
			return res
				.status(403)
				.json({ err: 'Same-origin request required.' });
		const session = await findVisitor(req);
		if (!session)
			return res
				.status(401)
				.json({ err: 'Demo session expired. Start a new demo.' });
		const writeBytes = req.body
			? Buffer.byteLength(JSON.stringify(req.body))
			: 0;
		if (writeBytes > 16384)
			return res.status(413).json({ err: 'Demo request is too large.' });
		const budget = await prisma.demoVisit.updateMany({
			where: {
				userId: session.userId,
				expiresAt: { gt: new Date() },
				requests: { lt: 1000 },
				writeBytes: { lte: 500000 - writeBytes },
			},
			data: {
				requests: { increment: 1 },
				writeBytes: { increment: writeBytes },
			},
		});
		if (!budget.count)
			return res
				.status(429)
				.json({
					err: 'Demo request limit reached. Reset the demo to continue.',
				});
		if (
			['/api/upload', '/api/words'].includes(
				(req.url || '').split('?')[0],
			) ||
			(req.url?.startsWith('/api/invitations') && req.method !== 'GET')
		)
			return res
				.status(503)
				.json({
					err: 'Uploads, automatic translation and invitations are unavailable in this demo.',
				});
		await handler(req, res);
	};
}
