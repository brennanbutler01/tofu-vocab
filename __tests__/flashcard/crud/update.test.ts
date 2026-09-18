import flashcardUpdate from 'flashcard/crud/update';
import { flashcardData } from 'mocks/mock-data/flashcard';
import { prismaMock } from 'setupTests';

describe('FlashcardUpdate should work as intended', () => {
	it('makes api put requestss to update the api flashcard', () => {
		const res = flashcardUpdate.apiUpdateFlashcard(flashcardData[0].id, {
			...flashcardData[0],
			front: ['test'],
		});
		expect(res).resolves.toEqual({ ...flashcardData[0], front: ['test'] });
	});

	it('makes db requests to update our db flashcards', () => {
		prismaMock.flashcard.update.mockResolvedValue({
			...flashcardData[0],
			front: ['test'],
		});
		expect(
			flashcardUpdate.dbUpdateFlashcard(flashcardData[0].id, {
				front: ['test'],
			}),
		).resolves.toEqual({ ...flashcardData[0], front: ['test'] });
	});
});
