import { AuthButton } from '@/components/AuthButton';
import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

describe('AuthButton should work as intended', () => {
	it('shows loading state', () => {
		const { getByRole } = render(
			<SessionProvider>
				<AuthButton sessionStatus="loading" />
			</SessionProvider>,
		);
		expect(getByRole('presentation')).toBeInTheDocument();
	});

	it('shows sign in when not authenticated', () => {
		const { getByRole, getByText } = render(
			<SessionProvider>
				<AuthButton sessionStatus="unauthenticated" />
			</SessionProvider>,
		);
		expect(getByRole('button')).toBeEnabled();
		expect(getByText(/sign in/i)).toBeInTheDocument();
	});

	it('shows sign out when  authenticated', () => {
		const { getByRole, getByText } = render(
			<SessionProvider>
				<AuthButton sessionStatus="authenticated" />
			</SessionProvider>,
		);
		expect(getByRole('button')).toBeEnabled();
		expect(getByText(/sign out/i)).toBeInTheDocument();
	});

	it('will render the name rather than the email if we pass both', () => {
		const { getByText, queryByText } = render(
			<SessionProvider>
				<AuthButton
					sessionStatus="authenticated"
					wrapperType="navItem"
					email="bb@bb.com"
					name={'Bobby'}
				/>
			</SessionProvider>,
		);
		expect(getByText(/bobby/i)).toBeInTheDocument();
		expect(queryByText(/bb@bb.com/i)).not.toBeInTheDocument();
	});
});
