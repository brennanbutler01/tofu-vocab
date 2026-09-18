import { Stack } from '@mantine/core';
import { FlashcardSources } from '@prisma/client';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import Head from 'next/head';
import FlashcardSearchGrid from '../flashcard/FlashcardSearchGrid';
import { FlashcardStatsTitleGroup } from './FlashcardStatsTitleGroup';
import { Layout } from '../Layout';
import { useState } from 'react';

type Props = {
	inProgress: FlashcardWithBox[];
};

export default function InProgressPage({ inProgress }: Props) {
	const [empty, setEmpty] = useState(false);
	return (
		<div>
			<Head>
				<title>Cards in Progress - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout>
				<Stack>
					<FlashcardStatsTitleGroup
						title={'Cards in progress'}
						source={FlashcardSources.IN_PROGRESS}
					/>
					<FlashcardSearchGrid
						flashcards={inProgress}
						setEmpty={setEmpty}
					/>
				</Stack>
			</Layout>
		</div>
	);
}
