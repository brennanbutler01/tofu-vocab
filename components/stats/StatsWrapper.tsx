import { Stack } from '@mantine/core';

type Props = { children: React.ReactNode };
export const StatsWrapper = ({ children }: Props) => {
	return (
		<Stack
			justify={'space-between'}
			h={'100%'}
		>
			{children}
		</Stack>
	);
};
