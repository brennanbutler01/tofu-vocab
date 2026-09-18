import flashcardsGet from 'flashcard/crud/getMany';
import { flashcardData, flashcardsWithBoxes } from 'mocks/mock-data/flashcard';
import { prismaMock } from 'setupTests';
import { transformMockedData } from 'utils/transformMockedData';

//TODO - write tests for getMany that include dynamic source - we need to tet others , not just ALL
describe('getMany flashcards should work as intended', () => {
	it('should make an api call and return all flashcards if we have them', async () => {
		expect(await flashcardsGet.apiGetFlashcards('ALL')).toEqual(
			flashcardData.map(transformMockedData),
		);
	});

	it('db get should work', async () => {
		prismaMock.flashcard.findMany.mockResolvedValue(flashcardsWithBoxes);
		expect(await flashcardsGet.dbGetFlashcards('1')).toEqual(
			flashcardsWithBoxes,
		);
	});
});
