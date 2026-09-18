import { Stack } from '@mantine/core';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import Head from 'next/head';
import FlashcardSearchGrid from '../flashcard/FlashcardSearchGrid';
import { Layout } from '../Layout';
import { FlashcardSources } from '@prisma/client';
import { FlashcardStatsTitleGroup } from './FlashcardStatsTitleGroup';
import { useState } from 'react';

type Props = {
	notYetStudied: FlashcardWithBox[];
};

export default function NotStudiedPage({ notYetStudied }: Props) {
	const [empty, setEmpty] = useState(false);
	return (
		<div>
			<Head>
				<title>Cards Not Studied - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout>
				<Stack>
					<FlashcardStatsTitleGroup
						title={"Cards you haven't studied"}
						source={FlashcardSources.NOT_STUDIED}
					/>
					<FlashcardSearchGrid
						flashcards={notYetStudied}
						setEmpty={setEmpty}
					/>
				</Stack>
			</Layout>
		</div>
	);
}
