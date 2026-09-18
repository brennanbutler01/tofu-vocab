import StudyGroupEmpty from '@/components/groups/StudyGroupEmpty';
import { ModalsProvider } from '@mantine/modals';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('StudyGroupEmpty', () => {
	it('should render', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<StudyGroupEmpty search="" />
			</SessionProvider>,
		);
		expect(getByRole('button', { name: /create/i })).toBeInTheDocument();
		expect(
			getByRole('heading', { name: /no study groups/i }),
		).toBeInTheDocument();
		expect(getByRole('img')).toBeInTheDocument();
	});

	it('should render a different title if we are searching', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<StudyGroupEmpty search="test" />
			</SessionProvider>,
		);
		expect(
			getByRole('heading', { name: /no study groups match/i }),
		).toBeInTheDocument();
	});

	it('should open a create group modal on button click', async () => {
		const user = userEvent.setup();
		const { getByRole } = render(
			<ModalsProvider>
				<SessionProvider session={mockSession}>
					<StudyGroupEmpty search="" />
				</SessionProvider>
			</ModalsProvider>,
		);

		await user.click(getByRole('button'));
		expect(getByRole('dialog')).toBeInTheDocument();
	});
});
