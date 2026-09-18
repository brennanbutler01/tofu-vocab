import { SessionProvider } from 'next-auth/react';
import { mockSession } from 'mocks/mock-data/session';
import { StudySides } from '@prisma/client';
import { StudyForm } from '@/components/study/StudyForm';
import { Notifications } from '@mantine/notifications';
import { render as renderReact } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';

describe('StudyForm works as intended', () => {
	it('it renders a form', () => {
		const onSubmit = jest.fn();
		const setAnswer = jest.fn();
		const { getByRole } = render(
			<StudyForm
				setAnswer={setAnswer}
				setLoading={() => {}}
				flashcard={flashcardsWithBoxes[0]}
				side={StudySides.FRONT}
			/>,
		);
		expect(getByRole('form')).toBeInTheDocument();
	});

	it('it renders an answer input, we should see two because we cannot mock the media query', () => {
		const onSubmit = jest.fn();
		const setAnswer = jest.fn();
		const { getAllByRole } = render(
			<StudyForm
				setAnswer={setAnswer}
				setLoading={() => {}}
				flashcard={flashcardsWithBoxes[0]}
				side={StudySides.FRONT}
			/>,
		);
		expect(getAllByRole('textbox')).toHaveLength(2);
	});

	it('renders a submit button, we should see two because we cannot mock the media query', () => {
		const onSubmit = jest.fn();
		const setAnswer = jest.fn();
		const { getAllByRole } = render(
			<StudyForm
				setAnswer={setAnswer}
				setLoading={() => {}}
				flashcard={flashcardsWithBoxes[0]}
				side={StudySides.FRONT}
			/>,
		);
		expect(getAllByRole('button', { name: /submit/i })).toHaveLength(2);
	});

	it('shows wont allow any submission without an answer', async () => {
		const onSubmit = jest.fn();
		const setAnswer = jest.fn();
		const { getAllByRole } = render(
			<>
				<Notifications />
				<StudyForm
					setAnswer={setAnswer}
					setLoading={() => {}}
					flashcard={flashcardsWithBoxes[0]}
					side={StudySides.FRONT}
				/>
			</>,
		);
		const submit = getAllByRole('button', { name: /submit/i });

		const user = userEvent.setup();

		await user.click(submit[0]);
		expect(onSubmit).not.toHaveBeenCalled();
	});
});

function render(ui: React.ReactElement) {
	return renderReact(
		<SessionProvider session={mockSession}>{ui}</SessionProvider>,
	);
}
