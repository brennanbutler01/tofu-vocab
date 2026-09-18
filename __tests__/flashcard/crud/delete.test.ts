import flashcardDelete from 'flashcard/crud/delete';
import { flashcardData } from 'mocks/mock-data/flashcard';
import { prismaMock } from 'setupTests';

describe('delete crud flashcard methods should work as intended', () => {
	it('should make delete requests to the api', async () => {
		const res = flashcardDelete.apiDeleteFlashcard('1');
		expect(res).resolves.toEqual(flashcardData[0]);
	});

	it('should make delete requests to the db', async () => {
		prismaMock.flashcard.delete.mockResolvedValue(flashcardData[0]);
		expect(await flashcardDelete.dbDeleteFlashcard('1')).toEqual(
			flashcardData[0],
		);
	});
});
