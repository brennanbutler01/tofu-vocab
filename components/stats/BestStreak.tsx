import { Box, Group, ThemeIcon } from '@mantine/core';
import { User } from '@prisma/client';
import { MdBolt } from 'react-icons/md';
import { StatsCard } from './StatsCard';
import { StatsTitle } from './StatsTitle';
import { StatsValue } from './StatsValue';
import { StatsWrapper } from './StatsWrapper';

type Props = { user: User | undefined | void };
export default function BestStreak({ user }: Props) {
	return (
		<StatsCard
			sx={theme => ({
				backgroundColor:
					theme.colorScheme === 'light'
						? theme.fn.lighten(theme.colors.yellow[0], 0.75)
						: theme.fn.darken(theme.colors.yellow[5], 0.75),
			})}
		>
			<Box p="md">
				<StatsWrapper>
					<StatsTitle>Your best streak</StatsTitle>
					<StatsValue variant="pending">
						<Group noWrap>
							<ThemeIcon
								variant="light"
								radius="md"
								size="xl"
								color={'yellow'}
								data-testid={'bolt'}
							>
								<MdBolt size={20} />
							</ThemeIcon>
							{user?.bestStreak || '0'} correct
						</Group>
					</StatsValue>
				</StatsWrapper>
			</Box>
		</StatsCard>
	);
}
