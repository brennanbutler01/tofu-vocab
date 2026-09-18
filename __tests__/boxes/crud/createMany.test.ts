import createManyBoxes from 'boxes/crud/createMany';
import { boxes } from 'mocks/mock-data/boxes';
import { prismaMock } from 'setupTests';
import { transformMockedData } from 'utils/transformMockedData';

describe('Create many boxes', () => {
	it('should make an api request to create boxes', async () => {
		const createdBoxes = await createManyBoxes.apiCreateManyBoxes(
			boxes.map(box => ({
				boxNumber: box.boxNumber,
				userId: box.userId,
				created_at: box.created_at,
				id: box.id,
				updated_at: box.updated_at,
			})),
		);
		expect(createdBoxes).toEqual(boxes.map(transformMockedData));
	});

	it('should make a db call to create a box', async () => {
		prismaMock.leitnerBox.createMany.mockResolvedValue({
			count: boxes.length,
		});
		expect(await createManyBoxes.dbCreateManyBoxes(boxes)).toEqual({
			count: boxes.length,
		});
	});
});
