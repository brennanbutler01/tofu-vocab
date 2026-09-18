import { Card, Stack } from '@mantine/core';
import { IAPIGetWordResponse } from 'words/get';
import { Definition } from './Definition';
import PronunciationMenu from './PronunciationMenu';
import TranslationGrid from './TranslationGrid';

type Props = {
	translation?: string;
	word?: string;
	definition: IAPIGetWordResponse['definition'];
};

export default function DisplayWord({ translation, word, definition }: Props) {
	return (
		<Card.Section
			inheritPadding
			px="xl"
		>
			<Stack spacing={'xl'}>
				<TranslationGrid
					translation={translation}
					word={word}
				/>

				<Definition definition={definition} />
				<PronunciationMenu definition={definition} />
			</Stack>
		</Card.Section>
	);
}
