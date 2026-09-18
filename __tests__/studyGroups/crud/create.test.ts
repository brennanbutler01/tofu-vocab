import { mockGroup } from 'mocks/mock-data/group';

import { prismaMock } from 'setupTests';
import createStudyGroup from 'studyGroups/crud/create';

describe('study group create should work', () => {
	it('should make post requests to the api', () => {
		const res = createStudyGroup.apiCreateStudyGroup({
			...mockGroup,
			owner: { connect: { id: '1' } },
			users: { connect: { id: '1' } },
			flashcards: undefined,
		});
		expect(res).resolves.toEqual(mockGroup);
	});

	it('should make create requests to the db', () => {
		prismaMock.studyGroup.create.mockResolvedValue(mockGroup);
		expect(
			createStudyGroup.dbCreateStudyGroup({
				...mockGroup,
				owner: { connect: { id: '1' } },
				users: { connect: { id: '1' } },
				flashcards: undefined,
			}),
		).resolves.toEqual(mockGroup);
	});
});
