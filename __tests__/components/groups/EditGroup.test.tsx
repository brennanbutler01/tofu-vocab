import EditGroup from '@/components/groups/EditGroup';
import { ModalsProvider } from '@mantine/modals';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockGroup } from 'mocks/mock-data/group';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('EditGroup', () => {
	it('should render a  button', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<EditGroup group={mockGroup} />
			</SessionProvider>,
		);
		expect(getByRole('button')).toBeInTheDocument();
	});

	it('should open an edit modal on click', async () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<ModalsProvider>
					<EditGroup group={mockGroup} />
				</ModalsProvider>
			</SessionProvider>,
		);
		const user = userEvent.setup();
		await user.click(getByRole('button'));
		expect(getByRole('dialog')).toBeInTheDocument();
	});
});
