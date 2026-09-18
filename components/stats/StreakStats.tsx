import { SimpleGrid } from '@mantine/core';
import { useUserSWR } from 'user/swr';
import BestStreak from './BestStreak';
import CurrentStreak from './CurrentStreak';

export default function StreakStats() {
	const { user } = useUserSWR({});
	return (
		<SimpleGrid
			cols={1}
			breakpoints={[
				{ minWidth: 'xs', cols: 2 },
				{ minWidth: 'lg', cols: 1 },
				{ minWidth: 'xl', cols: 2 },
			]}
		>
			<BestStreak user={user} />
			<CurrentStreak user={user} />
		</SimpleGrid>
	);
}
