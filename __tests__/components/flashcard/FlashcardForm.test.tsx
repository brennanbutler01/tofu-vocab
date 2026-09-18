import { SWRConfig } from 'swr';
import type { ReactElement } from 'react';
import { FlashcardForm } from '@/components/flashcard/FlashcardForm';
import { Notifications } from '@mantine/notifications';
import { render as renderComponent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';
import { mockSession } from 'mocks/mock-data/session';
import { SessionProvider } from 'next-auth/react';

test('should render a form', () => {
	const onSubmit = jest.fn();
	const onReset = jest.fn();

	const { getByRole } = render(
		<SessionProvider>
			<FlashcardForm
				onReset={onReset}
				onSubmit={onSubmit}
			/>
		</SessionProvider>,
	);
	expect(getByRole('form')).toBeInTheDocument();
});

describe('duplicates should be detected', () => {
	//test duplicates
	test('form should show a duplicate notification if there is a full duplicate', async () => {
		const onSubmit = jest.fn();
		const onReset = jest.fn();
		const { getByRole } = render(
			<SessionProvider session={mockSession}>
				<FlashcardForm
					onReset={onReset}
					onSubmit={onSubmit}
				/>
			</SessionProvider>,
		);
		const user = userEvent.setup();
		await user.type(
			getByRole('textbox', { name: /front/i }),
			flashcardsWithBoxes[0].front.join(', '),
		);
		await user.type(
			getByRole('textbox', { name: /back/i }),
			flashcardsWithBoxes[0].back.join(', '),
		);
		await user.click(getByRole('button', { name: /create/i }));
		expect(getByRole('alert', { name: /duplicate/i })).toBeInTheDocument();
	});

	test('form should not show duplicate notification if the duplicate is the same item being edited', async () => {
		const onSubmit = jest.fn();
		const onReset = jest.fn();
		const { queryByRole, getByRole } = render(
			<SessionProvider session={mockSession}>
				<FlashcardForm
					editing
					flashcard={flashcardsWithBoxes[0]}
					onReset={onReset}
					onSubmit={onSubmit}
				/>
			</SessionProvider>,
		);
		const user = userEvent.setup();
		await user.type(
			getByRole('textbox', { name: /front/i }),
			flashcardsWithBoxes[0].front.join(', '),
		);
		await user.type(
			getByRole('textbox', { name: /back/i }),
			flashcardsWithBoxes[0].back.join(', '),
		);
		await user.click(getByRole('button', { name: /update/i }));
		expect(
			queryByRole('alert', { name: /duplicate/i }),
		).not.toBeInTheDocument();
	});
});

test('form should pass through and render any flashcard values', () => {
	const onSubmit = jest.fn();
	const onReset = jest.fn();
	const flashcard = flashcardsWithBoxes[0];
	const { getByLabelText } = render(
		<SessionProvider session={mockSession}>
			<FlashcardForm
				onReset={onReset}
				onSubmit={onSubmit}
				editing
				flashcard={flashcard}
			/>
		</SessionProvider>,
	);
	expect(getByLabelText(/front/i)).toHaveValue(flashcard.front.join(', '));
	expect(getByLabelText(/back/i)).toHaveValue(flashcard.back.join(', '));
});

describe('show notifications', () => {
	it('should show a cancel notification on cancel', async () => {
		const onSubmit = jest.fn();
		const onReset = jest.fn();
		const { getByRole, getByText } = render(
			<SessionProvider session={mockSession}>
				<>
					<Notifications />
					<FlashcardForm
						onReset={onReset}
						onSubmit={onSubmit}
					/>
				</>
			</SessionProvider>,
		);
		const user = userEvent.setup();
		await user.click(getByRole('button', { name: /cancel/i }));

		//on submit should show notification
		expect(getByText(/cancelled/i)).toBeInTheDocument();
	});

	it('should show a success notification on create', async () => {
		const onSubmit = jest.fn();
		const onReset = jest.fn();
		const { getByRole, getByText } = render(
			<SessionProvider session={mockSession}>
				<>
					<Notifications />
					<FlashcardForm
						onReset={onReset}
						onSubmit={onSubmit}
					/>
				</>
			</SessionProvider>,
		);
		const user = userEvent.setup();
		await user.type(getByRole('textbox', { name: /front/i }), 'front');
		await user.type(getByRole('textbox', { name: /back/i }), 'back');
		await user.click(getByRole('button', { name: /create/i }));

		//on submit should show notification
		expect(getByText(/created/i)).toBeInTheDocument();
	});

	it('should show a success notification on edit', async () => {
		const onSubmit = jest.fn();
		const onReset = jest.fn();
		const { getByRole, getByText } = render(
			<SessionProvider session={mockSession}>
				<>
					<Notifications />
					<FlashcardForm
						onReset={onReset}
						onSubmit={onSubmit}
						editing
						flashcard={flashcardsWithBoxes[0]}
					/>
				</>
			</SessionProvider>,
		);
		const user = userEvent.setup();
		await user.type(getByRole('textbox', { name: /front/i }), 'front');
		await user.type(getByRole('textbox', { name: /back/i }), 'back');
		await user.click(getByRole('button', { name: /update/i }));

		//on submit should show notification
		expect(getByText(/updated/i)).toBeInTheDocument();
	});
});

test('front and back inputs should be required', async () => {
	const onSubmit = jest.fn();
	const onReset = jest.fn();
	const { getByRole } = render(
		<SessionProvider session={mockSession}>
			<FlashcardForm
				onReset={onReset}
				onSubmit={onSubmit}
			/>
		</SessionProvider>,
	);
	const user = userEvent.setup();
	await user.click(getByRole('button', { name: /create/i }));
	expect(onSubmit).not.toHaveBeenCalled();
});

function render(element: ReactElement) { return renderComponent(<SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{element}</SWRConfig>); }
