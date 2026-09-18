import { mockUsers } from 'mocks/mock-data/user';
import { prismaMock } from 'setupTests';
import updateUser from 'user/crud/update';
import { transformMockedData } from 'utils/transformMockedData';

test('apiUpdateUser should make an api call and return the updated record', async () => {
	const res = await updateUser.apiUpdateUser('1', { name: 'mew' });
	expect(res).toEqual(transformMockedData({ ...mockUsers[0], name: 'mew' }));
});

test('dbUpdateUser should update the user in the db', async () => {
	prismaMock.user.update.mockResolvedValue({ ...mockUsers[0], name: 'mew' });
	expect(await updateUser.dbUpdateUser('1', { name: 'mew' }));
});

describe('updateStreak', () => {
	it('should decrement current streak  if we are wrong, should not modify best', () => {
		const res = updateUser.parseStreak(mockUsers[0], false);
		expect(res.newCurrent).toBe(-1);
		expect(res.newBest).toBe(mockUsers[0].bestStreak);
	});

	it('should increment our current streak if we are right', () => {
		const res = updateUser.parseStreak(mockUsers[0], true);
		expect(res.newCurrent).toBe(mockUsers[0].currentStreak + 1);
	});

	it('should set our best streak as our current + 1 if we are past our streak', () => {
		const res = updateUser.parseStreak(
			{ ...mockUsers[0], currentStreak: 3, bestStreak: 3 },
			true,
		);

		expect(res).toEqual({ newBest: 4, newCurrent: 4 });
	});
});
