import {
	ActionIcon,
	Group,
	LoadingOverlay,
	SimpleGrid,
	Stack,
	Text,
} from '@mantine/core';
import { useStatsSWR, useUserSWR } from 'user/swr';
import BestStreak from './BestStreak';
import CurrentStreak from './CurrentStreak';
import { StatsCard } from './StatsCard';
import { StatsTitle } from './StatsTitle';
import { StatsValue } from './StatsValue';
import { StatsWrapper } from './StatsWrapper';
import { BsArrowDownSquare } from 'react-icons/bs';
import Link from 'next/link';

export const StatsGrid = () => {
	const { userStats } = useStatsSWR();
	const { user } = useUserSWR({});

	const config: Record<
		string,
		{
			title: string;
			value?: string | undefined;
			variant: 'success' | 'pending' | 'warning' | undefined;
			href: string | undefined;
		}
	> = {
		accountAge: {
			title: 'Account Age',
			value: userStats?.accountAge,
			variant: undefined,
			href: undefined,
		},
		cardsInBoxFour: {
			title: 'Completed cards',
			value: userStats?.cardsInBoxFour?._count + ' cards',
			variant: 'success',
			href: '/stats/completed',
		},
		cardsInProgress: {
			title: 'Cards in Progress',
			value: userStats?.cardsInProgress?._count + ' cards',
			variant: 'pending',
			href: '/stats/inProgress',
		},
		cardsNotYetStudied: {
			title: 'Cards not Studied',
			value: userStats?.cardsNotYetStudied?._count + ' cards',
			variant: 'warning',
			href: '/stats/notStudied',
		},
	};

	const stats = Object.entries(config).map(
		([k, { title, value, variant, href }]) => (
			<StatsCard key={k}>
				<StatsWrapper>
					<Stack>
						<StatsTitle>{title}</StatsTitle>
						{href ? (
							<Group>
								<Link
									href={href}
									passHref
									style={{
										display: 'flex',
										justifyContent: 'start',
									}}
								>
									<ActionIcon
										size="xl"
										radius="md"
										variant="light"
										color="gray"
									>
										<BsArrowDownSquare />
									</ActionIcon>
								</Link>
								<Text
									size="xs"
									color="dimmed"
								>
									view cards
								</Text>
							</Group>
						) : null}
					</Stack>
					<StatsValue variant={variant}>{value}</StatsValue>
				</StatsWrapper>

				<LoadingOverlay visible={!userStats} />
			</StatsCard>
		),
	);
	return (
		<SimpleGrid
			w={'100%'}
			cols={1}
			breakpoints={[
				{ minWidth: 'xs', cols: 2 },
				{ minWidth: 'md', cols: 3 },
				{ minWidth: 'xl', cols: 6 },
			]}
			spacing="xl"
		>
			{[
				...stats,
				<BestStreak
					user={user}
					key="best"
				/>,
				<CurrentStreak
					user={user}
					key="current"
				/>,
			]}
		</SimpleGrid>
	);
};
