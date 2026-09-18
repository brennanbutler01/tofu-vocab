import FlashcardOrigin from '@/components/flashcard/FlashcardOrigin';
import { render } from '@testing-library/react';

describe('FlashcardOrigin', () => {
	it('should render the passed in origin as group', () => {
		const { getByText } = render(<FlashcardOrigin origin="GROUP" />);
		expect(getByText('group')).toBeInTheDocument();
	});

	it('should render the passed in origin as user', () => {
		const { getByText } = render(<FlashcardOrigin origin="USER" />);
		expect(getByText('user')).toBeInTheDocument();
	});

	it('should render the passed in origin as random word', () => {
		const { getByText } = render(<FlashcardOrigin origin="RANDOM_WORD" />);
		expect(getByText('word')).toBeInTheDocument();
	});
});
