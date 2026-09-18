import React from 'react';
import { Text, useMantineTheme } from '@mantine/core';

type Props = { children: React.ReactNode };

export const StatsTitle = ({ children }: Props) => {
	const theme = useMantineTheme();
	return (
		<Text
			size="xl"
			fw={500}
			color={
				theme.colorScheme === 'dark'
					? theme.colors.dark[0]
					: theme.colors.dark[8]
			}
		>
			{children}
		</Text>
	);
};
