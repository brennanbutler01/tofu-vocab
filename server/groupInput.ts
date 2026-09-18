import { z } from 'zod';
const id = z.string().min(1).max(200);
const connect = z.object({ connect: z.object({ id }).strict() }).strict();
const card = z
	.object({
		front: z.array(z.string().trim().min(1).max(1000)).min(1).max(30),
		back: z.array(z.string().trim().min(1).max(1000)).min(1).max(30),
	})
	.strict();
export const groupEditSchema = z
	.object({
		name: z.string().trim().min(1).max(200),
		description: z.string().max(5000),
		allowJoin: z.boolean(),
		flashcards: z
			.object({
				createMany: z
					.object({ data: z.array(card).max(1000) })
					.strict(),
				deleteMany: z.array(z.object({ id }).strict()).max(1000),
			})
			.strict(),
	})
	.strict();
export const groupCreateSchema = z
	.object({
		name: z.string().trim().min(1).max(200),
		description: z.string().max(5000),
		allowJoin: z.boolean(),
		owner: connect,
		users: connect,
		image: z.null().optional(),
		createdAt: z.unknown().optional(),
		updatedAt: z.unknown().optional(),
		flashcards: z
			.object({
				createMany: z
					.object({ data: z.array(card).max(1000) })
					.strict(),
			})
			.strict(),
	})
	.strict();
export const groupMembershipSchema = z.union([
	z.object({ users: connect }).strict(),
	z
		.object({
			users: z.object({ disconnect: z.object({ id }).strict() }).strict(),
		})
		.strict(),
]);
