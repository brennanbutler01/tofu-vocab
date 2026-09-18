import { createStyles, Divider, Stack } from '@mantine/core';
import { AppTitle } from '../AppTitle';
import { StatsGrid } from './StatsGrid';

const styles = createStyles(theme => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		marginTop: theme.spacing.xl,
		gap: theme.spacing.lg,
		padding: theme.spacing.lg,
		[`@media (min-width: ${theme.breakpoints.xs})`]: {
			flexDirection: 'row',
			gap: theme.spacing.xl,
		},
	},
}));

export function UserStats() {
	const { classes } = styles();

	return (
		<div className={classes.container}>
			<Stack spacing={'xl'}>
				<AppTitle text="Your stats" />
				<StatsGrid />
				<Divider />
			</Stack>
		</div>
	);
}
