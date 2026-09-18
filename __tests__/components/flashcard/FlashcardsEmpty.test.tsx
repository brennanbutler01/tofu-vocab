import { FlashcardsEmpty } from '@/components/flashcard/FlashcardsEmpty';
import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

describe('FlashcardsEmpty should render properly', () => {
	it('should render a button to create a flashcard', () => {
		const { getByRole } = render(
			<SessionProvider>
				<FlashcardsEmpty searching />
			</SessionProvider>,
		);
		expect(getByRole('button')).toBeInTheDocument();
	});

	it('should render an image', () => {
		const { getByRole } = render(
			<SessionProvider>
				<FlashcardsEmpty searching />
			</SessionProvider>,
		);
		expect(getByRole('img')).toBeInTheDocument();
	});

	it('should render a title that says that we have no matching flashcards if searching', () => {
		const { getByRole } = render(
			<SessionProvider>
				<FlashcardsEmpty searching />
			</SessionProvider>,
		);
		expect(
			getByRole('heading', { name: /no flashcards match/i }),
		).toBeInTheDocument();
	});
	it('should render a title that says that we have no flashcards if empty', () => {
		const { getByRole } = render(
			<SessionProvider>
				<FlashcardsEmpty searching={false} />
			</SessionProvider>,
		);
		expect(
			getByRole('heading', { name: /no flashcards/i }),
		).toBeInTheDocument();
	});
});
