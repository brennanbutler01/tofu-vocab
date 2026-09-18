import { Layout } from '@/components/Layout';
import { Title } from '@mantine/core';
import { render } from '@testing-library/react';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

jest.mock('next/router', () => require('next-router-mock'));

describe('Layout wrapper component works as intended', () => {
	it('layout requires authentication before rendering a protected page', () => {
		const { getByRole } = render(
			<SessionProvider>
				<Layout>
					<Title>test</Title>
				</Layout>
			</SessionProvider>,
		);
		expect(
			getByRole('heading', { name: /protected page/i }),
		).toBeInTheDocument();
	});

	it('if authenicated, layout will render children', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<Layout>
					<Title>test</Title>
				</Layout>
			</SessionProvider>,
		);
		expect(getByRole('heading', { name: /test/i })).toBeInTheDocument();
	});

	it('if we declare isProtected to be false, it should not require auth', () => {
		const { getByRole } = render(
			<SessionProvider>
				<Layout isProtected={false}>
					<Title>test</Title>
				</Layout>
			</SessionProvider>,
		);
		expect(getByRole('heading', { name: /test/i })).toBeInTheDocument();
	});
});
