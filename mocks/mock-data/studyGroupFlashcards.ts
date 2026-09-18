import { GroupFlashcard } from '@prisma/client';

export const mockStudyGroupFlashcard: GroupFlashcard = {
	id: '1',
	createdAt: new Date(),
	updatedAt: new Date(),
	back: ['back'],
	front: ['front'],
	groupId: '1',
};
