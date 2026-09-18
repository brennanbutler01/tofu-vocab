import { StudyAttempt } from '@prisma/client';

//mock StudyAttempt data
export const attempts: StudyAttempt[] = [
	{
		created_at: new Date(),
		flashcardId: '1',
		id: '1',
		updated_at: new Date(),
		userId: '1',
		isCorrect: false,
	},
];
