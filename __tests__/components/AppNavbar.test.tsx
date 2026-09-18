import { AppNavbar } from '@/components/AppNavbar';
import { links } from '@/components/Layout';
import { ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

describe('AppNavbar works as intended', () => {
	it('renders an sign in button if we arent signed in, but no links', async () => {
		const { getByRole, queryByRole } = render(
			<ColorSchemeProvider
				colorScheme={'light'}
				toggleColorScheme={function (
					colorScheme?: ColorScheme | undefined,
				): void {
					throw new Error('Function not implemented.');
				}}
			>
				<SessionProvider session={null}>
					<AppNavbar links={links} />
				</SessionProvider>
			</ColorSchemeProvider>,
		);
		expect(getByRole('button', { name: /loading/i })).toBeInTheDocument();
		expect(queryByRole('link')).not.toBeInTheDocument();
	});

	it('renders links if we are signed in', async () => {
		const { queryByRole } = render(
			<ColorSchemeProvider
				colorScheme={'light'}
				toggleColorScheme={function (
					colorScheme?: ColorScheme | undefined,
				): void {
					throw new Error('Function not implemented.');
				}}
			>
				<SessionProvider session={mockSession}>
					<AppNavbar links={links} />
				</SessionProvider>
			</ColorSchemeProvider>,
		);
		expect(
			queryByRole('link', { name: /flashcards/i }),
		).toBeInTheDocument();
		expect(queryByRole('link', { name: /^study$/i })).toBeInTheDocument();
	});
});
