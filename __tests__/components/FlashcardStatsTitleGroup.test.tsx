import { FlashcardStatsTitleGroup } from '@/components/stats/FlashcardStatsTitleGroup';
import { render } from '@testing-library/react';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('FlashcardStatsTitleGroup', () => {
	it('rendes a title', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<FlashcardStatsTitleGroup
					source="ALL"
					title="Title"
				/>
			</SessionProvider>,
		);
		expect(getByRole('heading', { name: 'Title' })).toBeInTheDocument();
	});

	it('renders a button', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<FlashcardStatsTitleGroup
					source="ALL"
					title="Title"
				/>
			</SessionProvider>,
		);
		expect(getByRole('button')).toBeInTheDocument();
	});
});
