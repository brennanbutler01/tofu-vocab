import DeleteGroup from '@/components/groups/DeleteGroup';
import { ModalsProvider } from '@mantine/modals';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockGroup } from 'mocks/mock-data/group';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('DeleteGroup', () => {
	it('should render a button', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<DeleteGroup
					group={mockGroup}
					setLoading={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(
			getByRole('button', { name: /delete group/i }),
		).toBeInTheDocument();
	});

	it('should open a delete confirmation modal on click', async () => {
		const user = userEvent.setup();
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<ModalsProvider>
					<DeleteGroup
						group={mockGroup}
						setLoading={jest.fn()}
					/>
				</ModalsProvider>
			</SessionProvider>,
		);
		await user.click(getByRole('button', { name: /delete group/i }));
		expect(getByRole('dialog')).toBeInTheDocument();
	});
});
