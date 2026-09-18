import { SWRConfig } from 'swr';
import type { ReactElement } from 'react';
import { render as renderComponent, waitFor } from '@testing-library/react';
import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';
import Flashcards from '@/components/flashcard/index';
import userEvent from '@testing-library/user-event';
import { serializeFullFlashcard } from 'flashcard/serialize';

describe('FlashcardsPage should render properly', () => {
	it('should have a title', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<Flashcards data={[]} />
			</SessionProvider>,
		);
		expect(
			getByRole('heading', {
				name: /your flashcards/i,
			}),
		).toBeInTheDocument();
	});

	it('should have a button for creating a new card', () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<Flashcards
					data={serializeFullFlashcard(flashcardsWithBoxes)}
				/>
			</SessionProvider>,
		);
		expect(
			getByRole('button', { name: /create flashcard/i }),
		).toBeInTheDocument();
	});

	it('should show our passed in flashcards - 6 in total', () => {
		const { getByText } = render(
			<SessionProvider session={mockSession}>
				<Flashcards
					data={serializeFullFlashcard(flashcardsWithBoxes)}
				/>
			</SessionProvider>,
		);
		expect(getByText('hi')).toBeInTheDocument();
		expect(getByText('congee')).toBeInTheDocument();
		expect(getByText('go to work')).toBeInTheDocument();
		expect(getByText('before')).toBeInTheDocument();
		expect(getByText('chicken')).toBeInTheDocument();
		expect(getByText('eat')).toBeInTheDocument();
	});

	it('should render an image if we have no cards', () => {
		const { getByRole, getByText } = render(
			<SessionProvider session={mockSession}>
				<Flashcards data={[]} />
			</SessionProvider>,
		);
		expect(getByRole('img')).toBeInTheDocument();
		expect(getByText(/no flashcards/i)).toBeInTheDocument();
	});
});

describe('flashcard search should work as intended', () => {
	it('should have a search', async () => {
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<Flashcards data={[]} />
			</SessionProvider>,
		);

		await waitFor(() => {
			expect(getByRole('search')).toBeInTheDocument();
		});
	});

	it('should only show the matching items if we have a search', async () => {
		const { getByText, getByRole, queryByText } = render(
			<SessionProvider session={mockSession}>
				<Flashcards
					data={serializeFullFlashcard(flashcardsWithBoxes)}
				/>
			</SessionProvider>,
		);

		const user = userEvent.setup();
		await user.type(getByRole('searchbox'), 'eat');
		expect(queryByText('hi')).not.toBeInTheDocument();
		expect(queryByText('congee')).not.toBeInTheDocument();
		expect(queryByText('go to work')).not.toBeInTheDocument();
		expect(queryByText('before')).not.toBeInTheDocument();
		expect(queryByText('chicken')).not.toBeInTheDocument();
		expect(getByText('eat')).toBeInTheDocument();
	});

	it('should show an empty if we have no matching search', async () => {
		const { getByText, getByRole } = render(
			<SessionProvider session={mockSession}>
				<Flashcards
					data={serializeFullFlashcard(flashcardsWithBoxes)}
				/>
			</SessionProvider>,
		);

		const user = userEvent.setup();
		await user.type(getByRole('searchbox'), 'ZZZZ');
		expect(getByRole('img')).toBeInTheDocument();
		expect(getByText(/no flashcards match/i)).toBeInTheDocument();
	});
});

function render(element: ReactElement) { return renderComponent(<SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{element}</SWRConfig>); }
