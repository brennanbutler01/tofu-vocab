import { useMantineTheme } from '@mantine/core';
import { Datum, ResponsiveCalendar } from '@nivo/calendar';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useAttemptsPerDaySWR } from 'user/swr';

type Props = { onClick: (d: Datum | Omit<Datum, 'data' | 'value'>) => void };

export default function ActivityPerDayCalendar({ onClick }: Props) {
	const { attemptsPerDay } = useAttemptsPerDaySWR();
	const session = useSession();
	const theme = useMantineTheme();

	return (
		<ResponsiveCalendar
			theme={{
				text: {
					fill:
						theme.colorScheme === 'dark'
							? theme.colors.dark[1]
							: 'initial',
				},
				tooltip: {
					basic: {
						color:
							theme.colorScheme === 'dark'
								? theme.black
								: theme.white,
					},
				},
			}}
			data={
				attemptsPerDay?.map(a => ({
					day: a.date,
					value: a.total,
				})) || []
			}
			from={dayjs(session?.data?.user?.created_at).format('YYYY-MM-DD')}
			to={dayjs().format('YYYY-MM-DD')}
			emptyColor={
				theme.colorScheme === 'light' ? '#eeeeee' : theme.colors.dark[0]
			}
			colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
			margin={{
				top: 40,
				right: 40,
				bottom: 40,
				left: 40,
			}}
			yearSpacing={40}
			onClick={onClick}
			monthBorderColor="#ffffff"
			dayBorderWidth={2}
			dayBorderColor="#ffffff"
			legends={[
				{
					anchor: 'bottom-right',
					direction: 'row',
					translateY: 36,
					itemCount: 4,
					itemWidth: 42,
					itemHeight: 36,
					itemsSpacing: 14,
					itemDirection: 'right-to-left',
				},
			]}
		/>
	);
}
