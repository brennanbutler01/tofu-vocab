import {
	Button,
	Container,
	createStyles,
	Group,
	rem,
	Text,
} from '@mantine/core';
import { TbCards } from 'react-icons/tb';
import NextLink from 'next/link';

const useStyles = createStyles(theme => ({
	wrapper: {
		position: 'relative',
		boxSizing: 'border-box',
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
	},

	inner: {
		position: 'relative',
		paddingTop: rem(120),
		paddingBottom: rem(120),

		[theme.fn.smallerThan('sm')]: {
			paddingBottom: rem(80),
			paddingTop: rem(80),
		},
	},

	title: {
		fontFamily: theme.headings.fontFamily,
		fontSize: rem(62),
		fontWeight: 900,
		lineHeight: 1.25,
		wordSpacing: 8,
		margin: 0,
		padding: 0,
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,

		[theme.fn.smallerThan('sm')]: {
			fontSize: rem(42),
			lineHeight: 1.2,
		},
	},

	description: {
		marginTop: theme.spacing.xl,
		fontSize: rem(24),

		[theme.fn.smallerThan('sm')]: {
			fontSize: rem(18),
		},
	},

	controls: {
		marginTop: `calc(${theme.spacing.xl} * 2)`,

		[theme.fn.smallerThan('sm')]: {
			marginTop: theme.spacing.xl,
		},
	},

	control: {
		height: rem(54),
		paddingLeft: rem(38),
		paddingRight: rem(38),

		[theme.fn.smallerThan('sm')]: {
			height: rem(54),
			paddingLeft: rem(18),
			paddingRight: rem(18),
			flex: 1,
		},
	},
}));

const HomeHero = () => {
	const { classes } = useStyles();

	return (
		<div className={classes.wrapper}>
			<Container
				size={700}
				className={classes.inner}
			>
				<h1 className={classes.title}>
					Studying{' '}
					<Text
						component="span"
						variant="gradient"
						inherit
					>
						tiếng Việt
					</Text>{' '}
					made easy!
				</h1>

				<Text
					className={classes.description}
					color="dimmed"
				>
					Discover new words, build study lists, create collaborative
					study groups, and review flashcards to stay on top of your
					Vietnamese language learning.
				</Text>

				<Group className={classes.controls}>
					<Button
						fullWidth
						size="xl"
						className={classes.control}
						component={NextLink}
						href={'/flashcards'}
						variant="gradient"
						leftIcon={<TbCards />}
					>
						Make Flashcards
					</Button>
				</Group>
			</Container>
		</div>
	);
};

export default HomeHero;
