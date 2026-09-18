import DeleteAccount from '@/components/DeleteAccount';
import { Menu } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionProvider } from 'next-auth/react';

describe('DeleteAccount', () => {
	it('renders a menu item', () => {
		const { getByRole } = render(
			<SessionProvider>
				<Menu>
					<DeleteAccount />
				</Menu>
			</SessionProvider>,
		);
		expect(getByRole('menuitem')).toBeInTheDocument();
	});

	it('should open a modal on click', async () => {
		const { getByRole } = render(
			<SessionProvider>
				<Menu>
					<ModalsProvider>
						<DeleteAccount />
					</ModalsProvider>
				</Menu>
			</SessionProvider>,
		);
		const user = userEvent.setup();
		await user.click(getByRole('menuitem'));
		expect(getByRole('dialog')).toBeInTheDocument();
	});
});
