import UnlinkGroup from '@/components/groups/UnlinkGroup';
import { render } from '@testing-library/react';
import { mockGroup } from 'mocks/mock-data/group';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('LinkGroup', () => {
	it('should render an unlink button', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<UnlinkGroup group={mockGroup} />
			</SessionProvider>,
		);
		expect(getByRole('button')).toBeInTheDocument();
	});
});
