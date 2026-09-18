import ToggleColorScheme from '@/components/ToggleColorScheme';
import { ColorScheme, ColorSchemeProvider, Menu } from '@mantine/core';
import { render } from '@testing-library/react';

describe('ToggleColorScheme', () => {
	it('renders a button', () => {
		const { getByRole } = render(
			<Menu>
				<ColorSchemeProvider
					colorScheme={'light'}
					toggleColorScheme={function (
						colorScheme?: ColorScheme | undefined,
					): void {
						throw new Error('Function not implemented.');
					}}
				>
					<ToggleColorScheme />
				</ColorSchemeProvider>
			</Menu>,
		);
		expect(getByRole('button')).toBeInTheDocument();
	});
});
