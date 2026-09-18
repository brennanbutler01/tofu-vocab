import { FlashcardList } from '@/components/flashcard/FlashcardList';
import { render } from '@testing-library/react';
import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';
import { SessionProvider } from 'next-auth/react';

describe('FlashcardList component', () => {
	it('should show our passed in flashcards - 6 in total', () => {
		const { getByText } = render(
			<FlashcardList
				data={flashcardsWithBoxes}
				searching
			/>,
		);
		expect(getByText('hi')).toBeInTheDocument();
		expect(getByText('congee')).toBeInTheDocument();
		expect(getByText('go to work')).toBeInTheDocument();
		expect(getByText('before')).toBeInTheDocument();
		expect(getByText('chicken')).toBeInTheDocument();
		expect(getByText('eat')).toBeInTheDocument();
	});

	it('should show the empty page if the flashcards are empty', () => {
		const { getByText } = render(
			<SessionProvider>
				<FlashcardList
					data={[]}
					searching
				/>
			</SessionProvider>,
		);
		expect(getByText(/no flashcards match/i)).toBeInTheDocument();
	});
});
