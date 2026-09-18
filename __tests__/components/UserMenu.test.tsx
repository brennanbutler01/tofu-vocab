import UserMenu from '@/components/UserMenu';
import { ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { getByText, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockSession } from 'mocks/mock-data/session';
import { mockUsers } from 'mocks/mock-data/user';
import { SessionProvider } from 'next-auth/react';

describe('UserMenu', () => {
	it('should render', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<UserMenu user={mockUsers[0]} />
			</SessionProvider>,
		);
		expect(getByRole('button')).toBeInTheDocument();
	});

	it('should open menu on click', async () => {
		const { getByRole } = render(
			<ColorSchemeProvider
				colorScheme={'light'}
				toggleColorScheme={function (
					colorScheme?: ColorScheme | undefined,
				): void {
					throw new Error('Function not implemented.');
				}}
			>
				<SessionProvider session={mockSession}>
					<UserMenu user={mockUsers[0]} />
				</SessionProvider>
			</ColorSchemeProvider>,
		);
		const user = userEvent.setup();
		await user.click(getByRole('button'));
		expect(getByRole('menu')).toBeInTheDocument();
	});

	it('menu should render links', async () => {
		const { getByRole } = render(
			<ColorSchemeProvider
				colorScheme={'light'}
				toggleColorScheme={function (
					colorScheme?: ColorScheme | undefined,
				): void {
					throw new Error('Function not implemented.');
				}}
			>
				<SessionProvider session={mockSession}>
					<UserMenu user={mockUsers[0]} />
				</SessionProvider>
			</ColorSchemeProvider>,
		);
		const user = userEvent.setup();
		await user.click(getByRole('button'));
		expect(getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument();
		expect(
			getByRole('menuitem', { name: 'Delete Account' }),
		).toBeInTheDocument();
		expect(getByRole('menuitem', { name: 'Sign Out' })).toBeInTheDocument();
	});

	it('should open delete modal on click', async () => {
		const { getByRole, getByText } = render(
			<ModalsProvider>
				<ColorSchemeProvider
					colorScheme={'light'}
					toggleColorScheme={function (
						colorScheme?: ColorScheme | undefined,
					): void {
						throw new Error('Function not implemented.');
					}}
				>
					<SessionProvider session={mockSession}>
						<UserMenu user={mockUsers[0]} />
					</SessionProvider>
				</ColorSchemeProvider>
			</ModalsProvider>,
		);
		const user = userEvent.setup();
		await user.click(getByRole('button'));
		expect(getByRole('menu')).toBeInTheDocument();
		await user.click(getByRole('menuitem', { name: 'Delete Account' }));
		expect(getByText('cancel')).toBeInTheDocument();
	});
});
