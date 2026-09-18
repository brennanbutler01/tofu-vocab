import { Box, Group, ThemeIcon, Text } from '@mantine/core';
import { User } from '@prisma/client';
import { AiFillFire } from 'react-icons/ai';
import { BiSad } from 'react-icons/bi';
import { StatsCard } from './StatsCard';
import { StatsTitle } from './StatsTitle';
import { StatsValue } from './StatsValue';
import { StatsWrapper } from './StatsWrapper';

type Props = { user: User | void | undefined };

export default function CurrentStreak({ user }: Props) {
	const safeStreak = user?.currentStreak || 0;
	return (
		<StatsCard
			sx={theme => ({
				backgroundColor:
					safeStreak >= 1
						? theme.colorScheme === 'light'
							? theme.fn.lighten(theme.colors.teal[0], 0.55)
							: theme.fn.darken(theme.colors.teal[8], 0.75)
						: theme.colorScheme === 'light'
						? theme.fn.lighten(theme.colors.pink[0], 0.55)
						: theme.fn.darken(theme.colors.pink[8], 0.75),
			})}
		>
			<Box p="md">
				<StatsWrapper>
					<StatsTitle>Your current streak</StatsTitle>
					<StatsValue
						variant={
							safeStreak === 0
								? 'pending'
								: safeStreak >= 1
								? 'success'
								: 'warning'
						}
					>
						<Group noWrap>
							<ThemeIcon
								variant="light"
								radius="md"
								size="xl"
								color={
									safeStreak === 0
										? 'gray'
										: safeStreak > 0
										? 'teal'
										: 'pink'
								}
							>
								{safeStreak > 0 ? (
									<AiFillFire
										size={18}
										data-testid={'fire'}
									/>
								) : (
									<BiSad
										size={18}
										data-testid={'sad'}
									/>
								)}
							</ThemeIcon>
							<Text>
								{safeStreak !== 0
									? Math.abs(safeStreak as number)
									: safeStreak}{' '}
								{safeStreak > 0 ? 'correct' : 'incorrect'}
							</Text>
						</Group>
					</StatsValue>
				</StatsWrapper>
			</Box>
		</StatsCard>
	);
}
