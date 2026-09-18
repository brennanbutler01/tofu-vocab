import ConfigureSource from '@/components/study/ConfigureSource';
import { ModalsProvider } from '@mantine/modals';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('ConfigureSource', () => {
	it('should text', () => {
		const { getByText } = render(
			<SessionProvider session={mockSession}>
				<ConfigureSource onSourceChange={jest.fn()} />
			</SessionProvider>,
		);
		expect(getByText('Configure source')).toBeInTheDocument();
	});

	it('should open a modal on click', async () => {
		const { getByRole, getByText } = render(
			<SessionProvider session={mockSession}>
				<ModalsProvider>
					<ConfigureSource onSourceChange={jest.fn()} />
				</ModalsProvider>
			</SessionProvider>,
		);
		const user = userEvent.setup();
		await user.click(getByText('Configure source'));
		expect(getByRole('dialog')).toBeInTheDocument();
	});
});
