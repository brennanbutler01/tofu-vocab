import { SessionProvider } from 'next-auth/react';
import { mockSession } from 'mocks/mock-data/session';
import CreateGroupButton from '@/components/groups/CreateGroupButton';
import { ModalsProvider } from '@mantine/modals';
import { render as renderReact } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('CreateGroupButton', () => {
	it('should render a button', () => {
		const { getByRole } = render(<CreateGroupButton />);
		expect(getByRole('button')).toBeInTheDocument();
	});

	it('should open a modal on click', async () => {
		const user = userEvent.setup();
		const { getByRole } = render(
			<ModalsProvider>
				<CreateGroupButton />
			</ModalsProvider>,
		);
		await user.click(getByRole('button'));
		expect(getByRole('dialog')).toBeInTheDocument();
	});
});

function render(ui: React.ReactElement) {
	return renderReact(
		<SessionProvider session={mockSession}>{ui}</SessionProvider>,
	);
}
