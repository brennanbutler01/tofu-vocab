import { StudySides } from '@prisma/client';
import { FlashcardSide } from '@/components/flashcard/FlashcardSide';
import { render } from '@testing-library/react';

describe('FlashcardSide should work as intended', () => {
	it('should render the passed in value as text', () => {
		const { getByText } = render(
			<FlashcardSide
				side="front"
				value={['test']}
			/>,
		);
		expect(getByText(/test/i)).toBeInTheDocument();
	});

	it('should render the passed in side as text', () => {
		const { getByText } = render(
			<FlashcardSide
				side="front"
				value={['test']}
			/>,
		);
		expect(getByText(/front/i)).toBeInTheDocument();
	});

	it('should render the back as text', () => {
		const { getByText } = render(
			<FlashcardSide
				side="back"
				value={['test']}
			/>,
		);
		expect(getByText(/back/i)).toBeInTheDocument();
	});
});
