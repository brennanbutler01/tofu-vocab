import GroupActions from '@/components/groups/GroupActions';
import { render } from '@testing-library/react';
import { mockGroup } from 'mocks/mock-data/group';
import { mockSession } from 'mocks/mock-data/session';
import { mockUsers } from 'mocks/mock-data/user';
import { SessionProvider } from 'next-auth/react';

describe('GroupActions', () => {
	it('should show the delete and edit button if we are the owner', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<GroupActions
					group={mockGroup}
					setLoading={jest.fn()}
					userId={'1'}
				/>
			</SessionProvider>,
		);
		expect(getByRole('button', { name: /edit/i })).toBeInTheDocument();
		expect(getByRole('button', { name: /delete/i })).toBeInTheDocument();
	});

	it('should show the link button if we are not a member', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<GroupActions
					group={{ ...mockGroup, users: [], ownerId: '2' }}
					setLoading={jest.fn()}
					userId={'1'}
				/>
			</SessionProvider>,
		);
		expect(
			getByRole('button', { name: /join group/i }),
		).toBeInTheDocument();
	});

	it('should show the unlink button if we are a member', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<GroupActions
					group={{
						...mockGroup,
						users: [mockUsers[0]],
						ownerId: '2',
					}}
					setLoading={jest.fn()}
					userId={'1'}
				/>
			</SessionProvider>,
		);
		expect(
			getByRole('button', { name: /leave group/i }),
		).toBeInTheDocument();
	});
});
