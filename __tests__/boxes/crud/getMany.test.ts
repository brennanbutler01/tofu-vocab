import getManyBoxes from 'boxes/crud/getMany';
import { boxes } from 'mocks/mock-data/boxes';
import { prismaMock } from 'setupTests';
import { transformMockedData } from 'utils/transformMockedData';

describe('Get many boxes', () => {
	it('should make an api request to get boxes', async () => {
		const createdBoxes = await getManyBoxes.apiGetManyBoxes();
		expect(createdBoxes).toEqual(boxes.map(transformMockedData));
	});

	it('should make a db call to get the boxes', async () => {
		prismaMock.leitnerBox.findMany.mockResolvedValue(boxes);
		expect(await getManyBoxes.dbGetManyBoxes('1')).toEqual(boxes);
	});
});
