import NotStudiedPage from '@/components/stats/NotStudied';
import { render } from '@testing-library/react';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('Box 4 Page', () => {
	it('should render a title', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<NotStudiedPage notYetStudied={[]} />
			</SessionProvider>,
		);
		expect(
			getByRole('heading', { name: /cards you haven't studied/i }),
		).toBeInTheDocument();
	});

	it('should render a search bar', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<NotStudiedPage notYetStudied={[]} />
			</SessionProvider>,
		);
		expect(getByRole('searchbox')).toBeInTheDocument();
	});
});
