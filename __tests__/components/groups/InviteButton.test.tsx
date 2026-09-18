import { SessionProvider } from 'next-auth/react';
import { mockSession } from 'mocks/mock-data/session';
import { render as renderReact, screen } from '@testing-library/react';
import InviteButton from '@/components/groups/InviteButton';
import { mockGroup } from '../../../mocks/mock-data/group';

describe('InviteButton', () => {
	beforeEach(() => render(<InviteButton group={mockGroup} />));

	it('should render a button', () => {
		expect(screen.getByRole('button')).toBeInTheDocument();
	});
});

function render(ui: React.ReactElement) {
	return renderReact(
		<SessionProvider session={mockSession}>{ui}</SessionProvider>,
	);
}
