import { UserStats } from '@/components/stats/UserStats';
import { render } from '@testing-library/react';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('UserStats component', () => {
	it('it should render title', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<UserStats />
			</SessionProvider>,
		);
		expect(
			getByRole('heading', { name: /your stats/i }),
		).toBeInTheDocument();
	});

	it('should stats cards', () => {
		const { getByText } = render(
			<SessionProvider session={mockSession}>
				<UserStats />
			</SessionProvider>,
		);
		expect(getByText('Account Age')).toBeInTheDocument();
		expect(getByText(/completed cards/i)).toBeInTheDocument();
		expect(getByText('Cards in Progress')).toBeInTheDocument();
		expect(getByText('Cards not Studied')).toBeInTheDocument();
	});
});
