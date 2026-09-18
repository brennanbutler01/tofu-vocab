import { StudySides } from '@prisma/client';
import { render } from '@testing-library/react';
import { flashcardData, flashcardsWithBoxes } from 'mocks/mock-data/flashcard';
import { ReviewAnswer } from '@/components/study/ReviewAnswer';

describe('ReviewAnswer component should function properly', () => {
	it('should render the passed in flashcard front', () => {
		const onAdvance = jest.fn();
		const { getByText } = render(
			<ReviewAnswer
				onAdvance={onAdvance}
				answer={{
					answer: 'test answer',
					flashcard: flashcardsWithBoxes[0],
					isCorrect: true,
					side: StudySides.FRONT,
				}}
			/>,
		);
		expect(
			getByText(flashcardData[0].front.join(', ')),
		).toBeInTheDocument();
	});

	it('should render the passed in flashcard back', () => {
		const onAdvance = jest.fn();
		const { getByText } = render(
			<ReviewAnswer
				onAdvance={onAdvance}
				answer={{
					answer: 'test answer',
					flashcard: flashcardsWithBoxes[0],
					isCorrect: true,
					side: StudySides.FRONT,
				}}
			/>,
		);
		expect(getByText(flashcardData[0].back.join(', '))).toBeInTheDocument();
	});

	it('should render the passed in answer', () => {
		const onAdvance = jest.fn();
		const { getByText } = render(
			<ReviewAnswer
				onAdvance={onAdvance}
				answer={{
					answer: 'test answer',
					flashcard: flashcardsWithBoxes[0],
					isCorrect: true,
					side: StudySides.FRONT,
				}}
			/>,
		);
		expect(getByText(/test answer/i)).toBeInTheDocument();
	});

	it('should render an advance button, we should have two because we cannot simulate the media query', () => {
		const onAdvance = jest.fn();
		const { getAllByRole } = render(
			<ReviewAnswer
				onAdvance={onAdvance}
				answer={{
					answer: 'test answer',
					flashcard: flashcardsWithBoxes[0],
					isCorrect: true,
					side: StudySides.FRONT,
				}}
			/>,
		);
		expect(getAllByRole('button', { name: /advance/i })).toHaveLength(2);
	});

	it('should show an alert', () => {
		const onAdvance = jest.fn();
		const { getByRole, getAllByRole } = render(
			<ReviewAnswer
				onAdvance={onAdvance}
				answer={{
					answer: 'test answer',
					flashcard: flashcardsWithBoxes[0],
					isCorrect: true,
					side: StudySides.FRONT,
				}}
			/>,
		);
		expect(getAllByRole('button', { name: /advance/i })).toHaveLength(2);
		expect(getByRole('alert')).toBeInTheDocument();
	});
});
