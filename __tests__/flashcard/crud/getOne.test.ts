import flashcardGet from 'flashcard/crud/getOne';
import { flashcardData } from 'mocks/mock-data/flashcard';
import { prismaMock } from 'setupTests';
import { transformMockedData } from 'utils/transformMockedData';

describe('flashcard crud getOne works as intended', () => {
	it('apiGetOneFlashcard should let us get one flashcard from the api if it exists', async () => {
		expect(await flashcardGet.apiGetOneFlashcard('1')).toEqual(
			transformMockedData(flashcardData[0]),
		);
	});

	it('rejects a missing flashcard instead of returning successful empty data', async () => {
		await expect(
			flashcardGet.apiGetOneFlashcard('------1'),
		).rejects.toMatchObject({ status: 404 });
	});

	it('dbGetOneFlashcard should call prisma', async () => {
		prismaMock.flashcard.findUnique.mockResolvedValue(flashcardData[0]);

		await expect(
			flashcardGet.dbGetOneFlashcard(flashcardData[0].id),
		).resolves.toEqual(flashcardData[0]);
	});
});
