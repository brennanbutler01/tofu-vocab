import { mockGroup } from 'mocks/mock-data/group';
import { prismaMock } from 'setupTests';
import deleteStudyGroup from 'studyGroups/crud/delete';

describe('delete crud study groups methods should work as intended', () => {
	it('should make delete requests to the api', async () => {
		const res = deleteStudyGroup.apiDeleteStudyGroup('1');
		expect(res).resolves.toEqual(mockGroup);
	});

	it('should make delete requests to the db', async () => {
		prismaMock.studyGroup.delete.mockResolvedValue(mockGroup);
		expect(await deleteStudyGroup.dbDeleteStudyGroup('1')).toEqual(
			mockGroup,
		);
	});
});
