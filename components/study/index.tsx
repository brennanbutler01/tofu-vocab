import { createStyles, Grid, Stack, Text } from '@mantine/core';
import Head from 'next/head';
import { FlashcardsEmpty } from '../flashcard/FlashcardsEmpty';
import { Layout } from '../Layout';
import { Loading } from '../Loading';
import { StudyCard } from './StudyCard';
import { useEffect, useState } from 'react';
import flashcardGet, { FlashcardWithBox } from 'flashcard/crud/getOne';
import { SideButtons } from './SideButtons';
import { AppTitle } from '../AppTitle';
import { useUserSWR } from 'user/swr';
import { StudySides, User } from '@prisma/client';
import { useFlashcardSWR } from 'flashcard/swr';
import StreakStats from '../stats/StreakStats';
import filterCardsBySource from 'flashcard/filterCardsBySource';

const styles = createStyles(theme => ({
	title: {
		fontSize: '48px',
		fontWeight: 500,
		fontFamily: theme.headings.fontFamily,
		[`@media(max-width: ${theme.breakpoints.xs})`]: {
			fontSize: '32px',
		},
	},
	subTitle: {
		fontSize: '16px',
		fontWeight: 400,
	},
}));

export type AnswerType = {
	answer: string;
	flashcard: FlashcardWithBox;
	isCorrect: boolean;
	side: StudySides;
};

type Props = {
	swrUser: User;
	studyCards: FlashcardWithBox[];
};

export default function Study({ swrUser, studyCards }: Props) {
	const { classes } = styles();
	const { user, isLoading: userLoading } = useUserSWR({
		fallbackData: swrUser,
	});
	const { flashcards, isLoading } = useFlashcardSWR({
		fallbackData: studyCards,
		source: user?.flashcardSource,
	});
	const [sideToStudy, setSideToStudy] = useState<StudySides>(
		user?.studySide || StudySides.FRONT,
	);
	const [answer, setAnswer] = useState<AnswerType | undefined>(undefined);
	const [studyCard, setStudyCard] = useState<FlashcardWithBox | null>(null);

	const getFlashcardToStudy = () => {
		if (flashcards) {
			setStudyCard(
				flashcardGet.getFlashcardToStudy(
					filterCardsBySource(
						flashcards,
						user?.flashcardSource || 'ALL',
					),
				),
			);
		}
	};

	useEffect(() => {
		if (!answer) {
			getFlashcardToStudy();
		}
	}, [answer, user?.flashcardSource, flashcards]);

	const body = (
		<>
			{studyCard ? (
				<Grid
					gutter="xl"
					sx={theme => ({ gridRow: theme.spacing.lg })}
					justify={'space-between'}
					p="xl"
				>
					<Grid.Col
						span={12}
						lg={7}
					>
						<StudyCard
							source={user?.flashcardSource}
							flashcard={studyCard}
							side={sideToStudy}
							answer={answer}
							setAnswer={setAnswer}
						/>
					</Grid.Col>
					<Grid.Col
						span={12}
						lg={5}
					>
						<StreakStats />
					</Grid.Col>
				</Grid>
			) : isLoading || userLoading ? (
				<Loading />
			) : (
				<FlashcardsEmpty
					searching={false}
					source={user?.flashcardSource}
					onSourceChange={() => setAnswer(undefined)}
				/>
			)}
		</>
	);

	return (
		<div>
			<Head>
				<title>Study - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout>
				<Stack mb="xl">
					<AppTitle text="Study" />

					<Text
						color="dimmed"
						className={classes.subTitle}
					>
						Practice your{' '}
						{user?.learningLanguage === 'VIETNAMESE'
							? 'Vietnamese'
							: 'English'}
						, track your progress and advance your knowledge.
					</Text>
					{!answer && (
						<SideButtons
							setSide={() =>
								setSideToStudy(
									sideToStudy === 'FRONT' ? 'BACK' : 'FRONT',
								)
							}
							side={sideToStudy}
						/>
					)}
				</Stack>

				<Stack
					justify={'center'}
					align={'center'}
					mt="xl"
				>
					{body}
				</Stack>
			</Layout>
		</div>
	);
}
