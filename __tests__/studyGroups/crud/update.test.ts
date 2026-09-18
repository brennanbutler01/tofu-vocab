import { mockGroup } from 'mocks/mock-data/group';
import { prismaMock } from 'setupTests';
import studyGroupUpdate from 'studyGroups/crud/update';

describe('StudyGroup update should work as intended', () => {
	it('makes api put requestss to update the api', () => {
		const res = studyGroupUpdate.apiUpdateStudyGroup(
			{
				...mockGroup,
				name: 'testero',
				users: { connect: { id: '1' } },
				owner: { connect: { id: '1' } },
				flashcards: undefined,
			},
			'1',
		);
		expect(res).resolves.toEqual({ ...mockGroup, name: 'testero' });
	});

	it('makes db requests to update our db study group', () => {
		prismaMock.studyGroup.update.mockResolvedValue({
			...mockGroup,
			name: 'testero',
		});
		expect(
			studyGroupUpdate.dbUpdateStudyGroup({ name: 'testero' }, '1'),
		).resolves.toEqual({ ...mockGroup, name: 'testero' });
	});
});
