import { DuplicateAlert } from '@/components/flashcard/DuplicateAlert';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('DuplicateAlert works properly', () => {
	it('renders an alert', () => {
		const handleClose = jest.fn();
		const { getByRole } = render(
			<DuplicateAlert handleClose={handleClose} />,
		);
		expect(getByRole('alert')).toBeInTheDocument();
	});

	it('should have a close button and clicking it calls the handleClose ', async () => {
		const handleClose = jest.fn();
		const { getByRole } = render(
			<DuplicateAlert handleClose={handleClose} />,
		);
		const btn = getByRole('button');
		expect(btn).toBeInTheDocument();
		const user = userEvent.setup();
		await user.click(btn);
		expect(handleClose).toHaveBeenCalledTimes(1);
	});
});
