import InProgressPage from '@/components/stats/InProgressPage';
import { render } from '@testing-library/react';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('Box 4 Page', () => {
	it('should render a title', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<InProgressPage inProgress={[]} />
			</SessionProvider>,
		);
		expect(
			getByRole('heading', { name: /cards in progress/i }),
		).toBeInTheDocument();
	});

	it('should render a search bar', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<InProgressPage inProgress={[]} />
			</SessionProvider>,
		);
		expect(getByRole('searchbox')).toBeInTheDocument();
	});
});
