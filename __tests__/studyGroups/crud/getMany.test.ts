import { mockGroups } from 'mocks/mock-data/group';
import { prismaMock } from 'setupTests';
import getManyStudyGroups from 'studyGroups/crud/getMany';
import { transformMockedData } from 'utils/transformMockedData';

describe('getMany studyGroups should work as intended', () => {
	it('should make an api call and return all study groups if we have them', async () => {
		expect(await getManyStudyGroups.apiGetStudyGroups()).toEqual(
			mockGroups.map(g => ({
				...transformMockedData(g),
				users: g.users.map(transformMockedData),
			})),
		);
	});

	it('db get should work', async () => {
		prismaMock.studyGroup.findMany.mockResolvedValue(mockGroups);
		expect(await getManyStudyGroups.dbGetStudyGroups('1')).toEqual(
			mockGroups,
		);
	});
});
