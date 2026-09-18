import { Card, createStyles, Group, LoadingOverlay } from '@mantine/core';
import { FlashcardSources, StudySides } from '@prisma/client';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { useFlashcardSWR } from 'flashcard/swr';
import React from 'react';
import { AnswerType } from '.';
import ConfigureSource from './ConfigureSource';
import { ManageStudy } from './ManageStudy';

const styles = createStyles(theme => ({
	container: {
		maxWidth: '640px',
	},
}));

type Props = {
	flashcard: FlashcardWithBox;
	side: StudySides;
	answer: AnswerType | undefined;
	setAnswer: React.Dispatch<React.SetStateAction<AnswerType | undefined>>;
	source?: FlashcardSources;
};

export function StudyCard({
	flashcard,
	side,
	answer,
	setAnswer,
	source = 'ALL',
}: Props) {
	const { classes } = styles();
	const { isLoading } = useFlashcardSWR({ source });
	return (
		<div className={classes.container}>
			<Group position="right">
				<ConfigureSource onSourceChange={() => setAnswer(undefined)} />
			</Group>
			<Card
				shadow="lg"
				radius={'md'}
				withBorder
				p="xl"
			>
				<ManageStudy
					answer={answer}
					flashcard={flashcard}
					setAnswer={setAnswer}
					side={side}
				/>
				<LoadingOverlay visible={isLoading} />
			</Card>
		</div>
	);
}
