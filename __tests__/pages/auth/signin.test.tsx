import { render } from '@testing-library/react';
type Provider = { id: string; name: string };
import SignIn from 'pages/auth/signin';

describe('Signin page should work as intended', () => {
	it('should render a title', () => {
		const { getByRole } = render(<SignIn providers={[]} />);
		expect(getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
	});

	it('should render a button to sign in', () => {
		const googleProvider = {
			id: 'google',
			name: 'Google',
			type: 'oauth',
		} as Provider;
		const { getByRole } = render(<SignIn providers={[googleProvider]} />);
		expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument();
	});
});
