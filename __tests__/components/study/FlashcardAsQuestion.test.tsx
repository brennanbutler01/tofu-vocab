import { FlashcardAsQuestion } from '@/components/study/FlashcardAsQuestion';
import { render } from '@testing-library/react';
import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';

describe('FlashcardAsQuestion renders properly', () => {
	it('shows the flashcard front', () => {
		const { getByText } = render(
			<FlashcardAsQuestion
				flashcard={flashcardsWithBoxes[0]}
				side="FRONT"
			/>,
		);
		expect(
			getByText(flashcardsWithBoxes[0].front.join(', ')),
		).toBeInTheDocument();
	});

	it('has a question label', () => {
		const { getByText } = render(
			<FlashcardAsQuestion
				flashcard={flashcardsWithBoxes[0]}
				side="BACK"
			/>,
		);
		expect(
			getByText(/what word matches the definition below?/i),
		).toBeInTheDocument();
	});
});
