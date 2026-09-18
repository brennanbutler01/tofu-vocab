import { FlashcardFlipButton } from '@/components/flashcard/FlashcardFlipButton';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('FlashcardFlipButton should work as intended', () => {
	it('should render a button', () => {
		const onClick = jest.fn();
		const { getByRole } = render(<FlashcardFlipButton onClick={onClick} />);
		expect(
			getByRole('button', { name: /flip-card-button/i }),
		).toBeInTheDocument();
	});

	it('should fire the handler on click', async () => {
		const onClick = jest.fn();
		const { getByRole } = render(<FlashcardFlipButton onClick={onClick} />);
		const btn = getByRole('button', { name: /flip-card-button/i });
		expect(btn).toBeInTheDocument();
		const user = userEvent.setup();
		await user.click(btn);
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
