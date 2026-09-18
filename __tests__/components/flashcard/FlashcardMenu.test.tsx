import { FlashcardMenu } from '@/components/flashcard/FlashcardMenu';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';

describe('FlashcardMenu should work as intended', () => {
	it('should render a button as the trigger', () => {
		const { getByRole } = render(
			<FlashcardMenu flashcard={flashcardsWithBoxes[0]} />,
		);
		expect(getByRole('button')).toBeInTheDocument();
	});

	it('should render a menu when clicking on the trigger', async () => {
		const { getByRole } = render(
			<FlashcardMenu flashcard={flashcardsWithBoxes[0]} />,
		);
		const btn = getByRole('button');
		expect(btn).toBeInTheDocument();
		const user = userEvent.setup();
		await user.click(btn);
		expect(getByRole('menu')).toBeInTheDocument();
	});

	it('should render an edit and delete item', async () => {
		const { getByRole } = render(
			<FlashcardMenu flashcard={flashcardsWithBoxes[0]} />,
		);
		const btn = getByRole('button');
		expect(btn).toBeInTheDocument();
		const user = userEvent.setup();
		await user.click(btn);
		expect(getByRole('menu')).toBeInTheDocument();
		expect(getByRole('menuitem', { name: /edit/i })).toBeInTheDocument();
		expect(getByRole('menuitem', { name: /delete/i })).toBeInTheDocument();
	});
});
