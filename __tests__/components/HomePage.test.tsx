import HomePage from '@/components/HomePage';
import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

describe('Home', () => {
	it('renders a heading', () => {
		const { getByRole } = render(
			<SessionProvider>
				<HomePage />
			</SessionProvider>,
		);
		expect(
			getByRole('heading', { name: /studying tiếng Việt made easy/i }),
		).toBeInTheDocument();
	});
});
