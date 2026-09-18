import { createStyles, Stack, Text } from '@mantine/core';
import { StudySides } from '@prisma/client';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { bitter, raleway } from 'pages/_app';

const styles = createStyles(theme => ({
	question: {
		fontFamily: raleway.style.fontFamily,
		fontWeight: 300,
		letterSpacing: 1.3,

		fontSize: '48px',

		[`@media(max-width: ${theme.breakpoints.lg})`]: {
			fontSize: '40px',
		},
		[`@media(max-width: ${theme.breakpoints.md})`]: {
			fontSize: '28px',
		},

		[`@media(max-width: ${theme.breakpoints.xs})`]: {
			fontSize: '18px',
		},
	},
	answer: {
		fontFamily: bitter.style.fontFamily,
		fontWeight: 300,
		fontSize: '30px',
		[`@media(max-width: ${theme.breakpoints.md})`]: {
			fontSize: '22px',
		},

		[`@media(max-width: ${theme.breakpoints.xs})`]: {
			fontSize: '16px',
		},
	},
}));

type Props = {
	flashcard: FlashcardWithBox;
	side: StudySides;
};

//TODO - maybe replace thíis as líst
export function FlashcardAsQuestion({ flashcard, side }: Props) {
	const { classes } = styles();
	return (
		<Stack spacing={'xs'}>
			<Text
				size="lg"
				className={classes.question}
			>
				What word matches the definition below?
			</Text>
			<Text
				size="sm"
				color="dimmed"
				className={classes.answer}
			>
				{flashcard[side === 'FRONT' ? 'front' : 'back'].join(', ')}
			</Text>
		</Stack>
	);
}
