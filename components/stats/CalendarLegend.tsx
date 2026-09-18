import { createStyles, List, Stack, Text, Divider, Box } from '@mantine/core';

const styles = createStyles(theme => ({
	listWrapper: {
		'.mantine-List-itemWrapper': {
			alignItems: 'center',
		},
		fontSize: theme.fontSizes.sm,
	},
	colorCircle: {
		height: '12px',
		width: '12px',
		borderRadius: '50%',
		'&[data-variant="success"]': {
			backgroundColor: theme.colors.teal,
		},
		'&[data-variant="warning"]': {
			backgroundColor: theme.colors.yellow,
		},
		'&[data-variant="absent"]': {
			backgroundColor: theme.colors.red,
		},
	},
}));

export default function CalendarLegend() {
	const { classes } = styles();

	return (
		<Stack>
			<Text color="dimmed">Legend</Text>
			<Divider />
			<List
				mr="lg"
				p="lg"
			>
				<List.Item
					mt="md"
					className={classes.listWrapper}
					icon={
						<Box
							className={classes.colorCircle}
							data-variant="success"
						/>
					}
				>
					Studied
				</List.Item>
				<List.Item
					className={classes.listWrapper}
					icon={
						<Box
							className={classes.colorCircle}
							data-variant="warning"
						/>
					}
				>
					Haven't studied yet
				</List.Item>
				<List.Item
					className={classes.listWrapper}
					icon={
						<Box
							className={classes.colorCircle}
							data-variant="absent"
						/>
					}
				>
					Did not study
				</List.Item>
			</List>
		</Stack>
	);
}
