import { Card, CardProps } from '@mantine/core';
import React from 'react';

type Props = { children: React.ReactNode };
export const StatsCard = ({ children, ...rest }: Props & CardProps) => {
	return (
		<Card
			withBorder
			radius="md"
			shadow={'md'}
			{...rest}
		>
			{children}
		</Card>
	);
};
