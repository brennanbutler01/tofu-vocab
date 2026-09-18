import { StudySides } from '@prisma/client';
import { render } from '@testing-library/react';
import { ManageStudy } from '@/components/study/ManageStudy';

import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';
import { SessionProvider } from 'next-auth/react';

describe('ManageStudy should work as intended', () => {
	it('renders review answer if we have an answer and arent out of more questions', () => {
		const setAnswer = jest.fn();
		const { getAllByRole } = render(
			<SessionProvider>
				<ManageStudy
					side={StudySides.FRONT}
					answer={{
						isCorrect: true,
						side: StudySides.FRONT,
						answer: 'answer',
						flashcard: flashcardsWithBoxes[0],
					}}
					flashcard={flashcardsWithBoxes[1]}
					setAnswer={setAnswer}
				/>
			</SessionProvider>,
		);
		//TODO - extend the resizeObserver mock to make usre that we can actually view it
		//we have two buttons - depending on the screen size.
		expect(getAllByRole('button', { name: /advance/i })).toHaveLength(2);
	});

	it('if we dont have an answer and we still have cards to study, we should show the study form', () => {
		const setAnswer = jest.fn();
		const { getByRole } = render(
			<SessionProvider>
				<ManageStudy
					side={StudySides.FRONT}
					answer={undefined}
					flashcard={flashcardsWithBoxes[1]}
					setAnswer={setAnswer}
				/>
			</SessionProvider>,
		);
		expect(getByRole('form', { name: /answer-form/i })).toBeInTheDocument();
	});
});
