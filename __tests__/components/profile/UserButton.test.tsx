import { UserButton } from '@/components/profile/UserButton';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('UserButton', () => {
	it('should render a button', () => {
		const { getByRole } = render(<UserButton setEditing={() => {}} />);
		expect(getByRole('button')).toBeInTheDocument();
	});

	it('should open a menu on click', async () => {
		const { getByRole } = render(<UserButton setEditing={() => {}} />);
		const user = userEvent.setup();
		await user.click(getByRole('button'));
		expect(getByRole('menu')).toBeInTheDocument();
	});
});
