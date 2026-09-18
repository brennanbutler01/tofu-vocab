import GroupCard from '@/components/groups/GroupCard';
import { render } from '@testing-library/react';
import { mockGroup } from 'mocks/mock-data/group';
import { mockSession } from 'mocks/mock-data/session';
import { mockUsers } from 'mocks/mock-data/user';
import { SessionProvider } from 'next-auth/react';

describe('GroupCard', () => {
	it('should show whether the group is public or private', () => {
		const { getByText } = render(
			<SessionProvider session={mockSession}>
				<GroupCard
					group={mockGroup}
					setLoading={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(getByText(/public/i)).toBeInTheDocument();
	});

	it('should render the name', () => {
		const { getByText } = render(
			<SessionProvider session={mockSession}>
				<GroupCard
					group={mockGroup}
					setLoading={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(getByText(mockGroup.name)).toBeInTheDocument();
	});

	it('should render the description', () => {
		const { getByText } = render(
			<SessionProvider session={mockSession}>
				<GroupCard
					group={mockGroup}
					setLoading={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(getByText(mockGroup.description)).toBeInTheDocument();
	});

	it('should render the flashcard length', () => {
		const { getByText } = render(
			<SessionProvider session={mockSession}>
				<GroupCard
					group={mockGroup}
					setLoading={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(
			getByText(`${mockGroup?.flashcards?.length} flashcards`),
		).toBeInTheDocument();
	});

	it('should render the flashcard length', () => {
		const { getByText } = render(
			<SessionProvider session={mockSession}>
				<GroupCard
					group={mockGroup}
					setLoading={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(
			getByText(`${mockGroup?.flashcards?.length} flashcards`),
		).toBeInTheDocument();
	});

	it('should delete and edit buttons if we are owner', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<GroupCard
					group={mockGroup}
					setLoading={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(
			getByRole('button', { name: /delete group/i }),
		).toBeInTheDocument();
		expect(
			getByRole('button', { name: /delete group/i }),
		).toBeInTheDocument();
	});

	it('should show the link button if we are not a member', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<GroupCard
					group={{ ...mockGroup, users: [], ownerId: '2' }}
					setLoading={jest.fn()}
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
				<GroupCard
					group={{
						...mockGroup,
						users: [mockUsers[0]],
						ownerId: '2',
					}}
					setLoading={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(
			getByRole('button', { name: /leave group/i }),
		).toBeInTheDocument();
	});
});
