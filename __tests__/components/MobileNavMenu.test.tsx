import { MobileNavMenu } from '@/components/MobileNavMenu';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionProvider } from 'next-auth/react';

describe('MobileNavMenu', () => {
	it('should render a button', () => {
		const { getByRole } = render(
			<SessionProvider>
				<MobileNavMenu
					links={[]}
					opened={false}
					onClick={jest.fn()}
					close={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(getByRole('button')).toBeInTheDocument();
	});

	it('should open a menu on click', async () => {
		const user = userEvent.setup();
		const { getByRole } = render(
			<SessionProvider>
				<MobileNavMenu
					links={[]}
					opened={false}
					onClick={jest.fn()}
					close={jest.fn()}
				/>
			</SessionProvider>,
		);
		expect(getByRole('button')).toBeInTheDocument();
		await user.click(getByRole('button'));
		expect(getByRole('menu')).toBeInTheDocument();
	});
});
