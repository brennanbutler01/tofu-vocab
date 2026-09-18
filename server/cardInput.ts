import { z } from 'zod';
import { FlashcardOrigins } from '@prisma/client';
export const cardTextSchema = z.object({
	front: z.array(z.string().trim().min(1).max(1000)).min(1).max(30),
	back: z.array(z.string().trim().min(1).max(1000)).min(1).max(30),
	origin: z.nativeEnum(FlashcardOrigins).default(FlashcardOrigins.USER),
});
// Strip legacy Prisma relationship and timestamp fields; the session determines ownership.
export const createCardSchema = cardTextSchema.extend({
	id: z.string().uuid().optional(),
});
export const createCardsSchema = z.array(createCardSchema).min(1).max(1000);
