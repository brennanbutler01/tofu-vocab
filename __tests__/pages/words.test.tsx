import { render } from '@testing-library/react';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';
import WordsPage from 'pages/words';

describe('WordsPage', () => {
	it('should render a title', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<WordsPage />
			</SessionProvider>,
		);
		expect(
			getByRole('heading', { name: /discover new words/i }),
		).toBeInTheDocument();
	});
});
