import flashcardCreate from 'flashcard/crud/create';
import { flashcardData } from 'mocks/mock-data/flashcard';
import { prismaMock } from 'setupTests';

describe('flashcard create should work', () => {
	it('should make post requests to the api', () => {
		const res = flashcardCreate.apiCreateFlashcard(
			{
				...flashcardData[0],
				createdBy: { connect: { id: '1' } },
				box: { connect: { id: '1' } },
			},
			'ALL',
		);
		expect(res).resolves.toEqual(flashcardData[0]);
	});

	it('should make create requests to the db', () => {
		prismaMock.flashcard.create.mockResolvedValue(flashcardData[0]);
		expect(
			flashcardCreate.dbCreateFlashcard(
				{
					...flashcardData[0],
					createdBy: { connect: { id: '1' } },
					box: { connect: { id: '1' } },
				},
				'1',
			),
		).resolves.toEqual(flashcardData[0]);
	});
});
