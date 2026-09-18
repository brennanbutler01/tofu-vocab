import { SideRadio } from '@/components/profile/SideRadio';
import UserForm from '@/components/profile/UserForm';
import { render } from '@testing-library/react';
import { mockUsers } from 'mocks/mock-data/user';
import { SessionProvider } from 'next-auth/react';

describe('UserForm works as intended', () => {
	it('renders a form', () => {
		const { getByRole } = render(
			<SessionProvider>
				<UserForm
					startEditing={jest.fn()}
					user={mockUsers[0]}
					editing={false}
					cancelEditing={jest.fn()}
					onSubmit={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(getByRole('form')).toBeInTheDocument();
	});

	it('should render radio group', () => {
		const { getByRole } = render(<SideRadio editing={true} />);
		expect(getByRole('radiogroup')).toBeInTheDocument();
	});

	it('renders a cancel and confirm buttons if editing', () => {
		const { getByRole, getAllByRole } = render(
			<SessionProvider>
				<UserForm
					startEditing={jest.fn()}
					user={mockUsers[0]}
					editing
					cancelEditing={jest.fn()}
					onSubmit={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(getAllByRole('button', { name: /cancel/i })).toHaveLength(1);
		expect(getByRole('button', { name: /confirm/i })).toBeInTheDocument();
	});

	it('should just render one button if we are not editing', () => {
		const { queryAllByRole } = render(
			<SessionProvider>
				<UserForm
					startEditing={jest.fn()}
					user={mockUsers[0]}
					editing={false}
					cancelEditing={jest.fn()}
					onSubmit={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(queryAllByRole('button')).toHaveLength(1);
	});
});
