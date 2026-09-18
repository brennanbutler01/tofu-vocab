import { Grid, useMantineTheme } from '@mantine/core';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { FlashcardItem } from './FlashcardItem';
import { FlashcardsEmpty } from './FlashcardsEmpty';

type Props = {
	data: Array<FlashcardWithBox>;
	searching: boolean;
};

export const FlashcardList = ({ data, searching }: Props) => {
	const gridChildren = data?.map(flashcard => (
		<Grid.Col
			key={flashcard.id}
			span={6}
			xs={4}
			sm={4}
			md={3}
			xl={2}
		>
			<FlashcardItem
				flashcard={flashcard}
				key={flashcard.id}
			/>
		</Grid.Col>
	));

	const theme = useMantineTheme();

	return data?.length > 0 ? (
		<Grid
			gutter={'xl'}
			sx={{ gridGap: theme.spacing.xl }}
		>
			{gridChildren}
		</Grid>
	) : (
		<FlashcardsEmpty searching={searching} />
	);
};
