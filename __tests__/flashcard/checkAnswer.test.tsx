import { flashcardData } from 'mocks/mock-data/flashcard';
import { checkAnswer } from 'flashcard/checkAnswer';

describe('CheckAnswer works properly', () => {
	it('should return true if we have a correct answer that matches the flashcard back', () => {
		const result = checkAnswer(
			flashcardData[0],
			flashcardData[0].back,
			'FRONT',
		);
		expect(result).toBe(true);
	});

	it('should return true if we have a correct answer that matches the flashcard front and are answering the backside', () => {
		const result = checkAnswer(
			flashcardData[0],
			flashcardData[0].front,
			'BACK',
		);
		expect(result).toBe(true);
	});

	it('should return false if we have a incorrect answer that matches the flashcard back', () => {
		const result = checkAnswer(
			flashcardData[0],
			['this is not the correct answer'],
			'FRONT',
		);
		expect(result).toBe(false);
	});
});
