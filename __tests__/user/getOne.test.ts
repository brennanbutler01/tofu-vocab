import { mockUsers } from 'mocks/mock-data/user';
import { prismaMock } from 'setupTests';
import getUser from 'user/crud/getOne';
import { transformMockedData } from 'utils/transformMockedData';

test('apiGetUser should get a user from the api', async () => {
	const res = await getUser.apiGetUser('1');
	expect(res).toEqual(transformMockedData(mockUsers[0]));
});

test('dbGetUser should get a user from the db', async () => {
	prismaMock.user.findUnique.mockResolvedValue(mockUsers[0]);
	expect(await getUser.dbGetUser('1')).toEqual(mockUsers[0]);
});
