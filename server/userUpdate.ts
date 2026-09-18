import { z } from 'zod';
import { FlashcardSources, Languages, StudySides } from '@prisma/client';

export const userUpdateSchema = z
	.object({
		name: z.string().trim().max(200).nullable().optional(),
		email: z.string().email().nullable().optional(),
		image: z.string().url().nullable().optional(),
		nativeLanguage: z.nativeEnum(Languages).optional(),
		learningLanguage: z.nativeEnum(Languages).optional(),
		studySide: z.nativeEnum(StudySides).optional(),
		flashcardSource: z.nativeEnum(FlashcardSources).optional(),
		timeZone: z
			.string()
			.max(100)
			.refine(value => {
				try {
					new Intl.DateTimeFormat('en', { timeZone: value });
					return true;
				} catch {
					return false;
				}
			})
			.optional(),
		bestStreak: z.number().int().min(0).max(1000000).optional(),
		currentStreak: z.number().int().min(-1000000).max(1000000).optional(),
	})
	.strict()
	.transform(({ email, ...editable }) => editable);
// Email is displayed by the legacy form but identity changes are never accepted here.

export function canAccessUser(userId: string, requestedId: unknown) {
	return userId.trim().length > 0 && userId === requestedId;
}
