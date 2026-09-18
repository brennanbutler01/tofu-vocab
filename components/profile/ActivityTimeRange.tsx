import { Box } from '@mantine/core';
import { ResponsiveCalendar } from '@nivo/calendar';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useStatsSWR } from 'user/swr';

export default function ActivityTimeRange() {
	const stats = useStatsSWR();
	const session = useSession();

	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	console.log('stats', stats);

	return (
		<Box h={700}>
			{selectedDate?.toISOString()}
			<ResponsiveCalendar
				onClick={day => setSelectedDate(new Date(day?.day))}
				data={
					[]
					// stats?.userStats
					// 	? stats?.userStats?.countPerDay?.map(day => ({
					// 			day: dayjs(day.date).format('YYYY-MM-DD'),
					// 			value: day.total_attempts,
					// 	  }))
					// 	: []
				}
				from={dayjs(session?.data?.user?.created_at).format(
					'YYYY-MM-DD',
				)}
				to={dayjs().format('YYYY-MM-DD')}
				emptyColor="#eeeeee"
				colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
				margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
				yearSpacing={40}
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
		</Box>
	);
}
