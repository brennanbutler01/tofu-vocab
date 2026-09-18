import StreakStats from '@/components/stats/StreakStats';
import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

describe('StreakStats', () => {
	it('should render streaks', () => {
		const { getByText } = render(
			<SessionProvider>
				<StreakStats />
			</SessionProvider>,
		);
		expect(getByText(/best streak/i)).toBeInTheDocument();
		expect(getByText(/current streak/i)).toBeInTheDocument();
	});
});
