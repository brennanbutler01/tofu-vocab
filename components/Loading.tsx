import { Container, createStyles, Loader, Stack, Text } from '@mantine/core';

const styles = createStyles(theme => ({
	container: {
		width: '100%',
		height: '100%',
		display: 'flex',
	},
	inner: {
		width: '100%',
	},
	title: {
		fontSize: '48px',
		color: theme.colors.dark[1],
		[`@media(max-width: ${theme.breakpoints.xs})`]: {
			fontSize: '32px',
		},
		[`@media(min-width: ${theme.breakpoints.xl})`]: {
			fontSize: '64px',
		},
	},
}));

export function Loading() {
	const { classes } = styles();
	return (
		<Container className={classes.container}>
			<Stack
				justify={'center'}
				align="center"
				className={classes.inner}
				spacing="xs"
			>
				<Text className={classes.title}>Fetching Data</Text>
				<Loader
					size="xl"
					aria-label="Loading spinner"
				/>
			</Stack>
		</Container>
	);
}
