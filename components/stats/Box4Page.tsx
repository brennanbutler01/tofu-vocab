import { Stack } from '@mantine/core';
import { FlashcardSources } from '@prisma/client';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import Head from 'next/head';
import FlashcardSearchGrid from '../flashcard/FlashcardSearchGrid';
import { FlashcardStatsTitleGroup } from './FlashcardStatsTitleGroup';
import { Layout } from '../Layout';
import { useState } from 'react';

type Props = {
	box4: FlashcardWithBox[];
};

export default function Box4Page({ box4 }: Props) {
	const [empty, setEmpty] = useState(false);
	return (
		<div>
			<Head>
				<title>Completed Cards - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout>
				<Stack>
					<FlashcardStatsTitleGroup
						title="Completed cards"
						source={FlashcardSources.BOX4}
					/>
					<FlashcardSearchGrid
						flashcards={box4}
						setEmpty={setEmpty}
					/>
				</Stack>
			</Layout>
		</div>
	);
}
