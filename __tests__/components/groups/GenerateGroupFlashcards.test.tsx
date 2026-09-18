import GenerateGroupFlashcards from '@/components/groups/GenerateGroupFlashcards';
import { ModalsProvider } from '@mantine/modals';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockGroup } from 'mocks/mock-data/group';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('GenerateGroupFlashcards', () => {
	it('should render a button', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<GenerateGroupFlashcards
					group={mockGroup}
					userId={'1'}
				/>
			</SessionProvider>,
		);

		expect(getByRole('button')).toBeInTheDocument();
	});

	it('button should be disabled if we have no cards to create', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<GenerateGroupFlashcards
					group={mockGroup}
					userId={'1'}
				/>
			</SessionProvider>,
		);

		expect(getByRole('button')).toBeDisabled();
	});

	it('button should be enabled if we have no cards to create', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<GenerateGroupFlashcards
					group={{
						...mockGroup,
						ownerId: '2',
						flashcards: [
							{
								back: ['back'],
								front: ['front'],
								createdAt: new Date(),
								groupId: '1',
								id: '1',
								updatedAt: new Date(),
							},
						],
					}}
					userId={'1'}
				/>
			</SessionProvider>,
		);

		expect(getByRole('button')).toBeEnabled();
	});

	it('should open a modal on click if we do have cards to create', async () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<ModalsProvider>
					<GenerateGroupFlashcards
						group={{
							...mockGroup,
							ownerId: '2',
							flashcards: [
								{
									back: ['back'],
									front: ['front'],
									createdAt: new Date(),
									groupId: '1',
									id: '1',
									updatedAt: new Date(),
								},
							],
						}}
						userId={'1'}
					/>
				</ModalsProvider>
			</SessionProvider>,
		);
		const user = userEvent.setup();
		await user.click(getByRole('button'));
		expect(getByRole('dialog')).toBeInTheDocument();
	});
});
