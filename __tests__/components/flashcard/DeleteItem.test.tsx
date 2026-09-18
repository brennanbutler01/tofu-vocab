import { DeleteItem } from '@/components/flashcard/DeleteItem';
import { Menu } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('DeleteItem for Flashcard should work as intended', () => {
	it('should render a menu item', () => {
		const onConfirm = jest.fn();
		const { getByRole } = render(
			<Menu>
				<DeleteItem onConfirm={onConfirm} />
			</Menu>,
		);

		expect(getByRole('menuitem', { name: /delete/i })).toBeInTheDocument();
	});

	it('should open delete flashcard modal on click', async () => {
		const onConfirm = jest.fn();
		const { getByRole, getByText } = render(
			<ModalsProvider>
				<Menu>
					<DeleteItem onConfirm={onConfirm} />
				</Menu>
			</ModalsProvider>,
		);

		const user = userEvent.setup();
		await user.click(getByRole('menuitem'));
		expect(getByRole('dialog')).toBeInTheDocument();
		expect(getByText(/delete flashcard/i)).toBeInTheDocument();
	});

	it('delete modal should render a confirmation message, and have a cancel and confirm button', async () => {
		const onConfirm = jest.fn();
		const { getByRole, getByText } = render(
			<ModalsProvider>
				<Menu>
					<DeleteItem onConfirm={onConfirm} />
				</Menu>
			</ModalsProvider>,
		);

		const user = userEvent.setup();
		await user.click(getByRole('menuitem'));
		expect(getByRole('dialog')).toBeInTheDocument();
		expect(
			getByText(/are you sure you want to delete this card?/i),
		).toBeInTheDocument();
		expect(getByRole('button', { name: /cancel/i })).toBeInTheDocument();
		expect(getByRole('button', { name: /confirm/i })).toBeInTheDocument();
	});

	it('clicking confirm should show us a notification and call the delete', async () => {
		const onConfirm = jest.fn();
		const { getByRole, getByText } = render(
			<ModalsProvider>
				<>
					<Notifications />
					<Menu>
						<DeleteItem onConfirm={onConfirm} />
					</Menu>
				</>
			</ModalsProvider>,
		);

		const user = userEvent.setup();
		await user.click(getByRole('menuitem'));
		expect(getByRole('dialog')).toBeInTheDocument();

		const confirm = getByRole('button', { name: /confirm/i });
		expect(confirm).toBeInTheDocument();
		await user.click(confirm);
		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(getByText(/deleted flashcard/i)).toBeInTheDocument();
	});

	it('clicking cancel should show us a notificatioon', async () => {
		const onConfirm = jest.fn();
		const { getByRole, getByText } = render(
			<ModalsProvider>
				<>
					<Notifications />
					<Menu>
						<DeleteItem onConfirm={onConfirm} />
					</Menu>
				</>
			</ModalsProvider>,
		);

		const user = userEvent.setup();
		await user.click(getByRole('menuitem'));
		expect(getByRole('dialog')).toBeInTheDocument();

		const cancel = getByRole('button', { name: /cancel/i });
		expect(cancel).toBeInTheDocument();
		await user.click(cancel);
		expect(getByText(/cancelled/i)).toBeInTheDocument();
	});
});
