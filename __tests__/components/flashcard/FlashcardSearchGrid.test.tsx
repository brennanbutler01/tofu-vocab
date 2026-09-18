import FlashcardSearchGrid from '@/components/flashcard/FlashcardSearchGrid';
import { render } from '@testing-library/react';
import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('FlashcardSearchGrid', () => {
	it('should render a search bar', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<FlashcardSearchGrid
					setEmpty={() => {}}
					flashcards={[]}
				/>
			</SessionProvider>,
		);
		expect(getByRole('searchbox')).toBeInTheDocument();
	});

	it('should render an image if we have no flashcards', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<FlashcardSearchGrid
					setEmpty={() => {}}
					flashcards={[]}
				/>
			</SessionProvider>,
		);
		expect(getByRole('img')).toBeInTheDocument();
	});

	it('should render our cards if we have some', () => {
		const { getAllByText } = render(
			<SessionProvider session={mockSession}>
				<FlashcardSearchGrid
					setEmpty={() => {}}
					flashcards={flashcardsWithBoxes}
				/>
			</SessionProvider>,
		);
		expect(getAllByText(/front/i)).toHaveLength(6);
	});
});
