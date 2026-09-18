import { Card, Group, LoadingOverlay, Stack, Text, Title } from '@mantine/core';
import getWords from 'words/get';
import useSWRMutation from 'swr/mutation';
import FetchWordButton from './FetchWordButton';
import DisplayWord from './DisplayWord';
import { CreateFlashcardButton } from '../flashcard/CreateButton';
import { FlashcardOrigins } from '@prisma/client';

export function WordCard() {
	const { trigger, data, isMutating } = useSWRMutation(
		'/api/words',
		async () => await getWords.apiGetWord(),
	);

	console.log(data);

	return (
		<Card
			radius="md"
			shadow="lg"
			withBorder
			p="lg"
		>
			<Stack>
				<Title
					order={3}
					// fw={300}
				>
					{data ? 'New word' : 'New word'}
				</Title>
				{data ? (
					<DisplayWord
						definition={data?.definition}
						translation={data?.word?.translation}
						word={data?.word?.text}
					/>
				) : (
					<Text
						size="sm"
						color="dimmed"
					>
						Click the button below to find a new word, explore its
						meanings, and create flashcards for you to study!
					</Text>
				)}
				<Group
					position="apart"
					p="lg"
				>
					<FetchWordButton trigger={trigger} />
					{data ? (
						<CreateFlashcardButton
							origin={FlashcardOrigins.RANDOM_WORD}
							variant="default"
							source={'ALL'}
							wordToPopulate={{
								translation: data?.word?.translation,
								word: data?.word?.text,
							}}
						/>
					) : null}
				</Group>
				<LoadingOverlay visible={isMutating} />
			</Stack>
		</Card>
	);
}
