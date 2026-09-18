import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

test('group isolation and concurrent study answers', async ({
	playwright,
	baseURL,
}) => {
	const first = await playwright.request.newContext({
		baseURL,
		extraHTTPHeaders: { Origin: baseURL! },
	});
	const second = await playwright.request.newContext({
		baseURL,
		extraHTTPHeaders: { Origin: baseURL! },
	});
	try {
		const user = await (await first.post('/api/demo/session')).json();
		expect((await second.post('/api/demo/session')).status()).toBe(200);
		const created = await first.post('/api/studyGroups', {
			data: {
				name: 'Private visitor group',
				description: 'Synthetic data',
				allowJoin: true,
				owner: { connect: { id: user.userId } },
				users: { connect: { id: user.userId } },
				flashcards: {
					createMany: {
						data: [{ front: ['group word'], back: ['từ'] }],
					},
				},
			},
		});
		expect(created.status()).toBe(200);
		const group = await created.json();
		expect((await second.get('/api/studyGroup/' + group.id)).status()).toBe(
			404,
		);
		expect(await (await second.get('/api/studyGroups')).json()).toEqual([]);
		expect(
			await (await second.get('/api/studyGroupFlashcards')).json(),
		).toEqual([]);
		const cards = await (await first.get('/api/flashcards/ALL')).json();
		const card = cards[0];
		const data = {
			attempts: {
				create: {
					isCorrect: true,
					user: { connect: { id: user.userId } },
				},
			},
			box: {
				connect: {
					userId_boxNumber: { userId: user.userId, boxNumber: 1 },
				},
			},
		};
		const answers = await Promise.all([
			first.put('/api/flashcard/' + card.id, { data }),
			first.put('/api/flashcard/' + card.id, { data }),
		]);
		expect(answers.map(answer => answer.status())).toEqual([200, 200]);
		const saved = await (
			await first.get('/api/flashcard/' + card.id)
		).json();
		expect(saved.attempts).toHaveLength(2);
		expect(saved.box.boxNumber).toBe(2);
		expect((await first.delete('/api/demo/session')).status()).toBe(204);
	} finally {
		await first.delete('/api/demo/session');
		await second.delete('/api/demo/session');
		await first.dispose();
		await second.dispose();
	}
});

test('expired sessions, request limits and physical cleanup', async ({
	request,
	baseURL,
}) => {
	test.skip(
		Boolean(process.env.VISITOR_URL),
		'Direct database inspection is restricted to the disposable local database.',
	);
	if (
		process.env.DATABASE_URL !==
		'postgresql://demo:local-demo-only@127.0.0.1:5193/tofu_vocab'
	)
		throw new Error('Disposable local database required.');
	const db = new PrismaClient({
		adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
	});
	const headers = { Origin: baseURL! };
	const first = await (
		await request.post('/api/demo/session', { headers })
	).json();
	try {
		await db.demoVisit.update({
			where: { userId: first.userId },
			data: { requests: 1000 },
		});
		expect((await request.get('/api/flashcards/ALL')).status()).toBe(429);
		const expired = new Date(Date.now() - 1000);
		await db.demoVisit.update({
			where: { userId: first.userId },
			data: { expiresAt: expired },
		});
		await db.session.updateMany({
			where: { userId: first.userId },
			data: { expires: expired },
		});
		expect((await request.get('/api/flashcards/ALL')).status()).toBe(401);
		expect(
			(await request.post('/api/demo/session', { headers })).status(),
		).toBe(200);
		expect(await db.user.count({ where: { id: first.userId } })).toBe(0);
		expect(
			await db.flashcard.count({ where: { userId: first.userId } }),
		).toBe(0);
	} finally {
		await request.delete('/api/demo/session', { headers });
		await db.$disconnect();
	}
});
