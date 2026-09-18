import { Languages, StudySides, User } from '@prisma/client';

export const mockUsers: User[] = [
	{
		email: 'test@test.com',
		emailVerified: new Date(),
		id: '1',
		image: '',
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
];
