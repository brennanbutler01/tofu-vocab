import { FlashcardItem } from '@/components/flashcard/FlashcardItem';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';

describe('FlashcardItem should render and work properly', () => {
	it('should render the front of the card at first', () => {
		const card = flashcardsWithBoxes[0];
		const { getByText } = render(<FlashcardItem flashcard={card} />);
		expect(getByText(/front/i)).toBeInTheDocument();
	});

	it('should have a button to flip the card', () => {
		const card = flashcardsWithBoxes[0];
		const { getByRole } = render(<FlashcardItem flashcard={card} />);
		expect(
			getByRole('button', { name: 'flip-card-button' }),
		).toBeInTheDocument();
	});

	it('clicking the button should flip the card', async () => {
		const card = flashcardsWithBoxes[0];
		const { getByText, getByRole } = render(
			<FlashcardItem flashcard={card} />,
		);
		const button = getByRole('button', { name: 'flip-card-button' });
		expect(button).toBeInTheDocument();
		const user = userEvent.setup();
		await user.click(button);
		expect(getByText(/back/i)).toBeInTheDocument();
	});

	it('should have a button to open a menu', () => {
		const card = flashcardsWithBoxes[0];
		const { getByRole } = render(<FlashcardItem flashcard={card} />);
		expect(
			getByRole('button', { name: 'flashcard-menu-button' }),
		).toBeInTheDocument();
	});

	it('should let us open the menu if we click the menu button', async () => {
		const card = flashcardsWithBoxes[0];
		const { getByRole } = render(<FlashcardItem flashcard={card} />);
		const user = userEvent.setup();
		await user.click(
			getByRole('button', { name: 'flashcard-menu-button' }),
		);
		expect(getByRole('menu')).toBeInTheDocument();
	});
});
