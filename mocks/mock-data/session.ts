import { Languages, StudySides } from '@prisma/client';
import { Session } from 'next-auth';

export const mockSession: Session = {
	user: {
		id: '1',
		email: 'test@test.com',
		emailVerified: new Date(),
		image: null,
		name: 'tester',
		learningLanguage: Languages.VIETNAMESE,
		nativeLanguage: Languages.ENGLISH,
		studySide: StudySides.FRONT,
		created_at: new Date(),
		currentStreak: 0,
		bestStreak: 0,
		flashcardSource: 'ALL',
		timeZone: 'America/New_York',
	},
	expires: new Date().toISOString(),
};
