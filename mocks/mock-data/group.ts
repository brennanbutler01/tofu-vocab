import { StudyGroupWithFlashcards } from 'studyGroups/crud/getMany';
import { mockUsers } from './user';

export const mockGroup: StudyGroupWithFlashcards = {
	allowJoin: true,
	createdAt: new Date(),
	description: 'Mock data',
	flashcards: [],
	id: '1',
	image: null,
	name: 'Test group',
	ownerId: mockUsers[0].id,
	updatedAt: new Date(),
	users: [mockUsers[0]],
};
export const mockGroups = [
	mockGroup,
	{
		allowJoin: true,
		createdAt: new Date(),
		description: 'Mock 2 data',
		flashcards: [],
		id: '2',
		image: null,
		name: 'mew',
		ownerId: mockUsers[0].id,
		updatedAt: new Date(),
		users: mockUsers,
	},
];
