import { LoadingOverlay, Stack } from '@mantine/core';
import React, { useState } from 'react';
import { ReviewAnswer } from './ReviewAnswer';
import { StudyForm } from './StudyForm';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { AnswerType } from '.';
import { StudySides } from '@prisma/client';

type Props = {
	flashcard: FlashcardWithBox;
	answer: AnswerType | undefined;
	setAnswer: React.Dispatch<React.SetStateAction<AnswerType | undefined>>;
	side: StudySides;
};

export function ManageStudy({ flashcard, answer, setAnswer, side }: Props) {
	const [loading, setLoading] = useState(false);

	const handleAdvance = async () => {
		if (answer) {
			setLoading(true);
			setAnswer(undefined);
			setLoading(false);
		}
	};

	const body = () => {
		//otherwise if it is not the last card and we have an answer
		if (answer) {
			return (
				<>
					<ReviewAnswer
						answer={answer}
						onAdvance={handleAdvance}
					/>
				</>
			);
		}

		return (
			<Stack>
				<StudyForm
					flashcard={flashcard}
					setAnswer={setAnswer}
					setLoading={setLoading}
					side={side}
				/>
				<LoadingOverlay visible={loading} />
			</Stack>
		);
	};
	return body();
}
