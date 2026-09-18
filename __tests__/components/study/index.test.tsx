import { mockSession } from 'mocks/mock-data/session';
import Study from '@/components/study';
import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

describe('StudyPage renders properly', () => {
	it('should render a title', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<Study
					swrUser={mockSession.user}
					studyCards={[]}
				/>
			</SessionProvider>,
		);
		expect(getByRole('heading', { name: /study/i })).toBeInTheDocument();
	});
});
