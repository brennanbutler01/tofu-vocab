import { TvHeader } from '@/components/TvHeader';
import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

describe('TVHeader component works as intended', () => {
	it('contains a title', () => {
		const { getByText } = render(
			<SessionProvider>
				<TvHeader links={[]} />
			</SessionProvider>,
		);
		expect(getByText('tofu.vocab')).toBeInTheDocument();
	});
});
