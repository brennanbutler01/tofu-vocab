import { EditItem } from '@/components/flashcard/EditItem';
import { Menu } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';

describe('EditItem for Flashcard should work as intended', () => {
	it('should render a menu item', () => {
		const { getByRole } = render(
			<Menu>
				<EditItem flashcard={flashcardsWithBoxes[0]} />
			</Menu>,
		);
		expect(getByRole('menuitem', { name: /edit/i })).toBeInTheDocument();
	});

	it('should open edit flashcard modal on click', async () => {
		const { getByRole, getByText } = render(
			<ModalsProvider>
				<Menu>
					<EditItem flashcard={flashcardsWithBoxes[0]} />
				</Menu>
			</ModalsProvider>,
		);
		const user = userEvent.setup();
		await user.click(getByRole('menuitem'));
		expect(getByRole('dialog')).toBeInTheDocument();
		expect(getByText(/edit flashcard/i)).toBeInTheDocument();
	});

	it('should populate form with this card', async () => {
		const { getByRole } = render(
			<ModalsProvider>
				<Menu>
					<EditItem flashcard={flashcardsWithBoxes[0]} />
				</Menu>
			</ModalsProvider>,
		);
		const user = userEvent.setup();
		await user.click(getByRole('menuitem'));
		expect(getByRole('form')).toBeInTheDocument();
		expect(getByRole('textbox', { name: /front/i })).toHaveValue(
			flashcardsWithBoxes[0].front.join(', '),
		);
		expect(getByRole('textbox', { name: /back/i })).toHaveValue(
			flashcardsWithBoxes[0].back.join(', '),
		);
	});
});
