import Box4Page from '@/components/stats/Box4Page';
import { render } from '@testing-library/react';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('Box 4 Page', () => {
	it('should render a title', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<Box4Page box4={[]} />
			</SessionProvider>,
		);
		expect(
			getByRole('heading', { name: /completed cards/i }),
		).toBeInTheDocument();
	});

	it('should render a search bar', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<Box4Page box4={[]} />
			</SessionProvider>,
		);
		expect(getByRole('searchbox')).toBeInTheDocument();
	});
});
