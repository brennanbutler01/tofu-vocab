import createBox from 'boxes/crud/create';
import { boxes } from 'mocks/mock-data/boxes';
import { prismaMock } from 'setupTests';
import { transformMockedData } from 'utils/transformMockedData';

describe('Create box', () => {
	it('should make an api request to create a box', async () => {
		const createdBox = await createBox.apiCreateBox({
			...boxes[0],
			user: {
				connect: {
					id: boxes[0].userId,
				},
			},
		});
		expect(createdBox).toEqual(transformMockedData(boxes[0]));
	});

	it('should make a db call to create a box', async () => {
		prismaMock.leitnerBox.create.mockResolvedValue(boxes[0]);
		expect(
			await createBox.dbCreateBox({
				...boxes[0],
				user: { connect: { id: '1' } },
			}),
		).toEqual(boxes[0]);
	});
});
