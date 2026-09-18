import LinkGroup from '@/components/groups/LinkGroup';
import { render } from '@testing-library/react';
import { mockGroup } from 'mocks/mock-data/group';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('LinkGroup', () => {
	it('should render a link button', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<LinkGroup group={mockGroup} />
			</SessionProvider>,
		);
		expect(getByRole('button')).toBeInTheDocument();
	});
});
