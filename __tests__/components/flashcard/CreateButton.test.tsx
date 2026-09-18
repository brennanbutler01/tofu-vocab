import { render } from '@testing-library/react';
import { CreateFlashcardButton } from '@/components/flashcard/CreateButton';
import userEvent from '@testing-library/user-event';
import { ModalsProvider } from '@mantine/modals';
import { SessionProvider } from 'next-auth/react';

describe('the create button should render and behave correctly', () => {
	it('should render a button', () => {
		const { getByRole } = render(
			<SessionProvider>
				<CreateFlashcardButton source="ALL" />
			</SessionProvider>,
		);
		expect(
			getByRole('button', { name: /create flashcard/i }),
		).toBeInTheDocument();
	});

	it('should open a modal when we click the button', async () => {
		const { getByRole } = render(
			<SessionProvider>
				<ModalsProvider>
					<CreateFlashcardButton source="ALL" />
				</ModalsProvider>
			</SessionProvider>,
		);
		const user = userEvent.setup();
		await user.click(getByRole('button', { name: /create flashcard/i }));
		expect(getByRole('dialog')).toBeInTheDocument();
		expect(getByRole('form')).toBeInTheDocument();
	});
});
