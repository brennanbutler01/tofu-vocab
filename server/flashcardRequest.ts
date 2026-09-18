import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { moveToBox } from 'flashcard/moveToBox';

const textValues = z.array(z.string().trim().min(1).max(1000)).min(1).max(30);
const editSchema = z.object({ front: textValues, back: textValues }).strict();
const answerSchema = z
	.object({
		attempts: z
			.object({
				create: z
					.object({
						isCorrect: z.boolean(),
						created_at: z.unknown().optional(),
						updated_at: z.unknown().optional(),
						user: z
							.object({
								connect: z.object({ id: z.string() }).strict(),
							})
							.strict(),
					})
					.strict(),
			})
			.strict(),
		box: z
			.object({
				connect: z
					.object({
						userId_boxNumber: z
							.object({
								userId: z.string(),
								boxNumber: z.number().int().min(0).max(4),
							})
							.strict(),
					})
					.strict(),
			})
			.strict(),
	})
	.strict();

type Card = { id: string; userId: string; box: { boxNumber: number } };
type Dependencies = {
	find: (scope: { id: string; userId: string }) => Promise<Card | null>;
	update: (input: {
		id: string;
		userId: string;
		data: Prisma.FlashcardUpdateInput;
	}) => Promise<unknown>;
	remove: (scope: { id: string; userId: string }) => Promise<unknown>;
};

export function createFlashcardRequest(dependencies: Dependencies) {
	return async ({
		userId,
		method,
		id,
		body,
	}: {
		userId: string;
		method: string | undefined;
		id: unknown;
		body: unknown;
	}) => {
		if (!userId.trim())
			return { status: 401, body: { err: 'Please sign in.' } };
		if (!['GET', 'PUT', 'DELETE'].includes(method || ''))
			return { status: 405, body: { err: 'Method not allowed.' } };
		if (typeof id !== 'string' || !id.trim())
			return {
				status: 400,
				body: { err: 'A flashcard ID is required.' },
			};
		const scope = { id, userId };
		const card = await dependencies.find(scope);
		if (!card || card.userId !== userId)
			return { status: 404, body: { err: 'Flashcard not found.' } };
		if (method === 'GET') return { status: 200, body: card };
		if (method === 'DELETE')
			return { status: 200, body: await dependencies.remove(scope) };
		const edit = editSchema.safeParse(body);
		if (edit.success)
			return {
				status: 200,
				body: await dependencies.update({ ...scope, data: edit.data }),
			};
		const answer = answerSchema.safeParse(body);
		if (
			!answer.success ||
			answer.data.attempts.create.user.connect.id !== userId ||
			answer.data.box.connect.userId_boxNumber.userId !== userId
		)
			return { status: 400, body: { err: 'Invalid flashcard update.' } };
		const isCorrect = answer.data.attempts.create.isCorrect;
		// Derive ownership, timestamps and the next box on the server.
		const data: Prisma.FlashcardUpdateInput = {
			attempts: {
				create: { isCorrect, user: { connect: { id: userId } } },
			},
			box: {
				connect: {
					userId_boxNumber: {
						userId,
						boxNumber: moveToBox(isCorrect, card.box.boxNumber),
					},
				},
			},
		};
		return {
			status: 200,
			body: await dependencies.update({ ...scope, data }),
		};
	};
}
