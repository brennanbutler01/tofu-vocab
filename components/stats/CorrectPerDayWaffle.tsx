import { useMantineTheme } from '@mantine/core';
import { ResponsiveWaffle } from '@nivo/waffle';
import { ICountPerDay } from 'user/crud/stats';

type Props = { data: ICountPerDay };

export default function CorrectPerDayWaffle({ data }: Props) {
	const theme = useMantineTheme();
	return (
		<ResponsiveWaffle
			theme={{
				tooltip: {
					basic: {
						color:
							theme.colorScheme === 'dark'
								? theme.black
								: theme.white,
					},
				},
			}}
			data={[
				{
					id: 'correct',
					label: 'correct',
					value: data?.correct,
				},
				{
					id: 'incorrect',
					label: 'incorrect',
					value: data?.incorrect,
				},
			]}
			columns={2}
			rows={data?.total || 0}
			total={data?.total}
			margin={{
				top: 10,
				right: 10,
				bottom: 10,
				left: 120,
			}}
			borderColor={{
				from: 'color',
				modifiers: [['darker', 0.3]],
			}}
			animate={true}
			colors={{ scheme: 'pastel2' }}
			legends={[
				{
					anchor: 'top-left',
					direction: 'column',
					justify: false,
					translateX: -100,
					translateY: 0,
					itemsSpacing: 4,
					itemWidth: 100,
					itemHeight: 20,
					itemDirection: 'left-to-right',
					itemOpacity: 1,
					itemTextColor: '#777',
					symbolSize: 20,
					effects: [
						{
							on: 'hover',
							style: {
								itemTextColor: '#000',
								itemBackground: '#f7fafb',
							},
						},
					],
				},
			]}
		/>
	);
}
