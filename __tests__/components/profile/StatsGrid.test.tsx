import { StatsGrid } from '@/components/stats/StatsGrid';
import { render } from '@testing-library/react';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('StatsGrid', () => {
	it('should stats cards', () => {
		const { getByText } = render(
			<SessionProvider session={mockSession}>
				<StatsGrid />
			</SessionProvider>,
		);
		expect(getByText('Account Age')).toBeInTheDocument();
		expect(getByText(/completed cards/i)).toBeInTheDocument();
		expect(getByText('Cards in Progress')).toBeInTheDocument();
		expect(getByText('Cards not Studied')).toBeInTheDocument();
	});
});
