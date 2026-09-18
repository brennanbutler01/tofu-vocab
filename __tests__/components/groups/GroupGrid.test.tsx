import GroupGrid from '@/components/groups/GroupGrid';
import { render } from '@testing-library/react';
import { mockGroups } from 'mocks/mock-data/group';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('GroupGrid', () => {
	it('should render child components', () => {
		const { getByText } = render(
			<SessionProvider session={mockSession}>
				<GroupGrid groups={mockGroups} />
			</SessionProvider>,
		);
		expect(getByText(mockGroups[0].name)).toBeInTheDocument();
		expect(getByText(mockGroups[1].name)).toBeInTheDocument();
	});
});
