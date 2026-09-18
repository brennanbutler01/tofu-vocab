import { createStyles, Text } from '@mantine/core';
import React from 'react';

const styles = createStyles(theme => ({
	colorVariants: {
		'&[data-variant="success"]': {
			color:
				theme.colorScheme === 'dark'
					? theme.colors.teal[2]
					: theme.colors.teal[8],
		},
		'&[data-variant="pending"]': {
			color:
				theme.colorScheme === 'dark'
					? theme.colors.orange[4]
					: theme.colors.orange[7],
		},
		'&[data-variant="warning"]': {
			color:
				theme.colorScheme === 'dark'
					? theme.colors.pink[4]
					: theme.colors.pink[7],
		},
	},
}));

type Props = {
	children: React.ReactNode;
	variant?: 'success' | 'warning' | 'pending';
};

export const StatsValue = ({ children, variant }: Props) => {
	const { classes } = styles();
	return (
		<Text
			color="dimmed"
			size="xl"
			weight={300}
			data-variant={variant}
			className={classes.colorVariants}
		>
			{children}
		</Text>
	);
};
