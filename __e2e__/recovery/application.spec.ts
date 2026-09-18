import { PrismaPg } from '@prisma/adapter-pg';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const database = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
const ownerId = randomUUID();
const otherId = randomUUID();
const sessionToken = randomUUID();
let cardId = '';
let groupId = '';

test.beforeAll(async () => {
	for (const id of [ownerId, otherId])
		await database.user.create({
			data: {
				id,
				name: 'Demo learner',
				email: id + '@example.invalid',
				boxes: {
					create: [0, 1, 2, 3, 4].map(boxNumber => ({ boxNumber })),
				},
			},
		});
	await database.session.create({
		data: {
			userId: ownerId,
			sessionToken,
			expires: new Date(Date.now() + 3600000),
		},
	});
	const box = await database.leitnerBox.findUniqueOrThrow({
		where: { userId_boxNumber: { userId: otherId, boxNumber: 0 } },
	});
	const card = await database.flashcard.create({
		data: {
			userId: otherId,
			boxId: box.id,
			front: ['private'],
			back: ['riêng tư'],
		},
	});
	cardId = card.id;
	const group = await database.studyGroup.create({
		data: {
			ownerId: otherId,
			name: 'Private group',
			description: 'Test fixture',
			allowJoin: false,
		},
	});
	groupId = group.id;
});

test.beforeEach(async ({ context }) => {
	await context.addCookies([
		{
			name: 'next-auth.session-token',
			value: sessionToken,
			url: 'http://127.0.0.1:5192',
			httpOnly: true,
			sameSite: 'Lax',
		},
	]);
});

test.afterAll(async () => {
	try {
		await database.invitation.deleteMany({
			where: {
				OR: [
					{ recipientId: { in: [ownerId, otherId] } },
					{ sentById: { in: [ownerId, otherId] } },
				],
			},
		});
		await database.studyGroup.deleteMany({
			where: { ownerId: { in: [ownerId, otherId] } },
		});
		await database.user.deleteMany({
			where: { id: { in: [ownerId, otherId] } },
		});
	} finally {
		await database.$disconnect();
	}
});

test('blocks cross-account reads, edits, deletion and private group access', async ({
	context,
}) => {
	for (const method of ['GET', 'PUT', 'DELETE']) {
		const response = await context.request.fetch(
			'/api/flashcard/' + cardId,
			{
				method,
				...(method === 'PUT'
					? { data: { front: ['stolen'], back: ['bad'] } }
					: {}),
			},
		);
		expect(response.status()).toBe(404);
	}
	expect(
		(await context.request.delete('/api/user/' + otherId)).status(),
	).toBe(404);
	expect(
		(
			await context.request.put('/api/user/' + ownerId, {
				data: { accounts: { deleteMany: {} } },
			})
		).status(),
	).toBe(400);
	expect(
		(await context.request.get('/api/studyGroup/' + groupId)).status(),
	).toBe(404);
	expect(
		(await context.request.delete('/api/studyGroup/' + groupId)).status(),
	).toBe(404);
	expect(await database.flashcard.count({ where: { id: cardId } })).toBe(1);
	expect(await database.user.count({ where: { id: otherId } })).toBe(1);
});

test('requires authentication before flashcard reads, uploads and translation', async ({
	playwright,
}) => {
	const anonymous = await playwright.request.newContext({
		baseURL: 'http://127.0.0.1:5192',
	});
	try {
		expect((await anonymous.get('/api/flashcard/' + cardId)).status()).toBe(
			401,
		);
		expect((await anonymous.post('/api/upload')).status()).toBe(401);
		expect((await anonymous.get('/api/words')).status()).toBe(401);
	} finally {
		await anonymous.dispose();
	}
});

test('creates, edits and deletes a flashcard through the real API', async ({
	context,
}) => {
	const created = await context.request.post('/api/flashcards/ALL', {
		data: {
			front: ['hello'],
			back: ['xin chào'],
			createdBy: { connect: { id: otherId } },
		},
	});
	expect(created.status()).toBe(200);
	const card = await created.json();
	expect(card.userId).toBe(ownerId);
	const edited = await context.request.put('/api/flashcard/' + card.id, {
		data: { front: ['thank you'], back: ['cảm ơn'] },
	});
	expect(edited.status()).toBe(200);
	expect((await edited.json()).front).toEqual(['thank you']);
	expect(
		(await context.request.delete('/api/flashcard/' + card.id)).status(),
	).toBe(200);
	expect(
		(await context.request.get('/api/flashcard/' + card.id)).status(),
	).toBe(404);
});

test('renders the signed-in application and creates a flashcard in the browser', async ({
	page,
}) => {
	const errors: string[] = [];
	page.on('pageerror', error => errors.push(error.message));
	await page.goto('/flashcards');
	await page
		.getByRole('button', { name: /create/i })
		.first()
		.click();
	await page.getByRole('textbox', { name: /front/i }).fill('browser hello');
	await page.getByRole('textbox', { name: /back/i }).fill('xin chào');
	await page.getByRole('button', { name: /^create$/i }).click();
	await expect(
		page.getByText('browser hello', { exact: true }).first(),
	).toBeVisible();
	await page.reload();
	await expect(
		page.getByText('browser hello', { exact: true }).first(),
	).toBeVisible();
	await page.goto('/study');
	await expect(
		page.getByRole('heading', { name: /study/i }).first(),
	).toBeVisible();
	await page.getByRole('textbox', { name: /^answer/i }).fill('xin chào');
	const answerSaved = page.waitForResponse(
		response =>
			response.url().includes('/api/flashcard/') &&
			response.request().method() === 'PUT',
	);
	await page.getByRole('button', { name: /^submit$/i }).click();
	expect((await answerSaved).status()).toBe(200);
	await expect(
		page.getByRole('button', { name: /^advance$/i }),
	).toBeVisible();
	expect(
		await database.studyAttempt.count({
			where: { userId: ownerId, isCorrect: true },
		}),
	).toBe(1);
	await page.screenshot({
		path: 'test-results/vocab-study-desktop.png',
		fullPage: true,
	});
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/flashcards');
	await expect(
		page.getByText('browser hello', { exact: true }).first(),
	).toBeVisible();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= window.innerWidth,
		),
	).toBe(true);
	await page.screenshot({
		path: 'test-results/vocab-flashcards-mobile.png',
		fullPage: true,
	});
	expect(errors).toEqual([]);
});

test('accepts private-group invitations only as the recipient and connects membership atomically', async ({
	context,
}) => {
	const invitation = await database.invitation.create({
		data: {
			id: randomUUID(),
			sentById: otherId,
			recipientId: ownerId,
			groupId,
			status: 'PENDING',
		},
	});
	const foreignInvite = await database.invitation.create({
		data: {
			id: randomUUID(),
			sentById: ownerId,
			recipientId: otherId,
			groupId,
			status: 'PENDING',
		},
	});
	expect(
		(
			await context.request.put('/api/invitations/' + foreignInvite.id, {
				data: { status: 'ACCEPTED' },
			})
		).status(),
	).toBe(404);
	expect(
		(
			await context.request.put('/api/invitations/' + invitation.id, {
				data: {
					status: 'ACCEPTED',
					recipient: { connect: { id: otherId } },
				},
			})
		).status(),
	).toBe(400);
	expect(
		(
			await context.request.put('/api/invitations/' + invitation.id, {
				data: { status: 'ACCEPTED' },
			})
		).status(),
	).toBe(200);
	expect(
		(
			await context.request.put('/api/invitations/' + invitation.id, {
				data: { status: 'ACCEPTED' },
			})
		).status(),
	).toBe(409);
	expect(
		(await context.request.get('/api/studyGroup/' + groupId)).status(),
	).toBe(200);
	expect(
		(await context.request.delete('/api/studyGroup/' + groupId)).status(),
	).toBe(403);
	expect(
		(
			await context.request.put('/api/studyGroup/' + groupId, {
				data: { users: { disconnect: { id: otherId } } },
			})
		).status(),
	).toBe(403);
	expect(
		(
			await context.request.put('/api/studyGroup/' + groupId, {
				data: { users: { disconnect: { id: ownerId } } },
			})
		).status(),
	).toBe(200);
	expect(
		(await context.request.get('/api/studyGroup/' + groupId)).status(),
	).toBe(404);
});

test('creates and edits groups with owner-scoped writes', async ({
	context,
}) => {
	const data = {
		name: 'Browser study group',
		description: 'Synthetic data',
		allowJoin: false,
		owner: { connect: { id: ownerId } },
		users: { connect: { id: ownerId } },
		flashcards: {
			createMany: { data: [{ front: ['hello'], back: ['xin chào'] }] },
		},
	};
	expect(
		(
			await context.request.post('/api/studyGroups', {
				data: { ...data, owner: { connect: { id: otherId } } },
			})
		).status(),
	).toBe(400);
	const created = await context.request.post('/api/studyGroups', { data });
	expect(created.status()).toBe(200);
	const group = await created.json();
	const edit = {
		name: 'Updated study group',
		description: 'Still synthetic',
		allowJoin: true,
		flashcards: { createMany: { data: [] }, deleteMany: [] },
	};
	expect(
		(
			await context.request.put('/api/studyGroup/' + group.id, {
				data: { ...edit, owner: { connect: { id: otherId } } },
			})
		).status(),
	).toBe(400);
	expect(
		(
			await context.request.put('/api/studyGroup/' + group.id, {
				data: edit,
			})
		).status(),
	).toBe(200);
	expect(
		(await context.request.delete('/api/studyGroup/' + group.id)).status(),
	).toBe(200);
});

test('keeps entered flashcard text when a save fails and allows retry', async ({
	page,
}) => {
	await page.goto('/flashcards');
	await page
		.getByRole('button', { name: /create/i })
		.first()
		.click();
	await page.getByRole('textbox', { name: /front/i }).fill('keep my text');
	await page.getByRole('textbox', { name: /back/i }).fill('giữ văn bản');
	await page.route('**/api/flashcards/ALL', route =>
		route.request().method() === 'POST'
			? route.fulfill({
					status: 503,
					contentType: 'application/json',
					body: '{"err":"Unavailable"}',
				})
			: route.continue(),
	);
	await page.getByRole('button', { name: /^create$/i }).click();
	await expect(
		page.getByText(/could not save your flashcard/i),
	).toBeVisible();
	await expect(page.getByRole('textbox', { name: /front/i })).toHaveValue(
		'keep my text',
	);
	await page.unroute('**/api/flashcards/ALL');
	const saved = page.waitForResponse(
		response =>
			response.url().includes('/api/flashcards/ALL') &&
			response.request().method() === 'POST',
	);
	await page.getByRole('button', { name: /^create$/i }).click();
	expect((await saved).status()).toBe(200);
	await page.reload();
	await expect(
		page.getByText('keep my text', { exact: true }).first(),
	).toBeVisible();
	expect(
		await database.flashcard.count({
			where: { userId: ownerId, front: { has: 'keep my text' } },
		}),
	).toBe(1);
});
