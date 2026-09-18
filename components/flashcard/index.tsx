import { CreateFlashcardButton } from '@/components/flashcard/CreateButton';
import { Layout } from '@/components/Layout';
import { Group, Stack } from '@mantine/core';
import { FlashcardOrigins } from '@prisma/client';
import { deserializeFullFlashcard } from 'flashcard/deserialize';
import { ISerializedFlashcardWithBox } from 'flashcard/serialize';
import { useFlashcardSWR } from 'flashcard/swr';
import Head from 'next/head';
import { AppTitle } from '../AppTitle';
import FlashcardSearchGrid from './FlashcardSearchGrid';
import { useState } from 'react';

type Props = { data: ISerializedFlashcardWithBox[] };

export default function FlashcardsPage({ data }: Props) {
	//init flashcard data.
	const swrFlashcards = useFlashcardSWR({
		fallbackData: deserializeFullFlashcard(data),
	});
	const [empty, setEmpty] = useState(swrFlashcards?.flashcards.length == 0);

	return (
		<div>
			<Head>
				<title>Flashcards - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout>
				<Stack>
					<Group position="apart">
						<AppTitle text="Your Flashcards" />
						{empty ? null : (
							<CreateFlashcardButton
								source="ALL"
								origin={FlashcardOrigins.USER}
							/>
						)}
					</Group>
					<FlashcardSearchGrid
						setEmpty={setEmpty}
						flashcards={swrFlashcards?.flashcards}
					/>
				</Stack>
			</Layout>
		</div>
	);
}
