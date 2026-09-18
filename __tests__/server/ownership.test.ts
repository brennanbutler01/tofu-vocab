import { createFlashcardRequest } from 'server/flashcardRequest';
import { canAccessUser, userUpdateSchema } from 'server/userUpdate';

function setup() {
	const writes: unknown[] = [];
	const scopes: unknown[] = [];
	const handler = createFlashcardRequest({
		find: async scope => {
			scopes.push(scope);
			return scope.userId === 'owner'
				? { id: 'card', userId: 'owner', box: { boxNumber: 0 } }
				: null;
		},
		update: async input => {
			writes.push(input);
			return input;
		},
		remove: async input => {
			writes.push(input);
			return input;
		},
	});
	return { handler, writes, scopes };
}

it.each(['GET', 'PUT', 'DELETE'])(
	'rejects anonymous and cross-user %s requests without writing',
	async method => {
		const { handler, writes, scopes } = setup();
		expect(
			(await handler({ userId: '', method, id: 'card', body: {} }))
				.status,
		).toBe(401);
		expect(scopes).toEqual([]);
		expect(
			(await handler({ userId: 'other', method, id: 'card', body: {} }))
				.status,
		).toBe(404);
		expect(scopes).toEqual([{ id: 'card', userId: 'other' }]);
		expect(writes).toEqual([]);
	},
);

it('edits only text and refuses nested account changes', async () => {
	const { handler, writes } = setup();
	expect(
		(
			await handler({
				userId: 'owner',
				method: 'PUT',
				id: 'card',
				body: {
					front: ['hello'],
					back: ['xin chào'],
					createdBy: { update: { email: 'other@example.com' } },
				},
			})
		).status,
	).toBe(400);
	expect(writes).toEqual([]);
	expect(
		(
			await handler({
				userId: 'owner',
				method: 'PUT',
				id: 'card',
				body: {
					front: [' hello '],
					back: ['xin chào'],
				},
			})
		).status,
	).toBe(200);
	expect(writes).toEqual([
		{
			id: 'card',
			userId: 'owner',
			data: { front: ['hello'], back: ['xin chào'] },
		},
	]);
});

it('recalculates box progression and ignores client-supplied attempt timestamps', async () => {
	const { handler, writes } = setup();
	const body = {
		attempts: {
			create: {
				isCorrect: true,
				created_at: '2099-01-01',
				user: { connect: { id: 'owner' } },
			},
		},
		box: {
			connect: { userId_boxNumber: { userId: 'owner', boxNumber: 4 } },
		},
	};
	expect(
		(await handler({ userId: 'owner', method: 'PUT', id: 'card', body }))
			.status,
	).toBe(200);
	expect(writes).toEqual([
		{
			id: 'card',
			userId: 'owner',
			data: {
				attempts: {
					create: {
						isCorrect: true,
						user: { connect: { id: 'owner' } },
					},
				},
				box: {
					connect: {
						userId_boxNumber: { userId: 'owner', boxNumber: 1 },
					},
				},
			},
		},
	]);
	body.attempts.create.user.connect.id = 'other';
	expect(
		(await handler({ userId: 'owner', method: 'PUT', id: 'card', body }))
			.status,
	).toBe(400);
	expect(writes).toHaveLength(1);
});

it('restricts profile access and rejects nested Prisma writes', () => {
	expect(canAccessUser('owner', 'other')).toBe(false);
	expect(canAccessUser('', '')).toBe(false);
	expect(canAccessUser('owner', 'owner')).toBe(true);
	expect(
		userUpdateSchema.safeParse({ accounts: { deleteMany: {} } }).success,
	).toBe(false);
	expect(userUpdateSchema.safeParse({ id: 'other' }).success).toBe(false);
	expect(
		userUpdateSchema.safeParse({ name: 'Demo learner', studySide: 'BACK' })
			.success,
	).toBe(true);
});
