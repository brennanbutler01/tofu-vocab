import { Alert, Text, useMantineTheme } from '@mantine/core';
import { ResponsiveStream } from '@nivo/stream';
import { BiError } from 'react-icons/bi';
import { useAttemptsPerDaySWR } from 'user/swr';

export default function ActivityPerDayStream() {
	const { attemptsPerDay } = useAttemptsPerDaySWR();
	const theme = useMantineTheme();

	return attemptsPerDay && attemptsPerDay?.length >= 2 ? (
		<ResponsiveStream
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
					table: {
						color:
							theme.colorScheme === 'dark'
								? theme.black
								: theme.white,
					},
				},
			}}
			data={
				attemptsPerDay
					? attemptsPerDay?.map(d => ({
							correct: d.correct,
							incorrect: d.incorrect,
						}))
					: []
			}
			keys={['correct', 'incorrect']}
			margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
			axisTop={null}
			axisRight={null}
			axisBottom={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: '',
				legendOffset: 36,
			}}
			enableGridX={true}
			enableGridY={false}
			offsetType="none"
			curve="catmullRom"
			colors={{ scheme: 'pastel2' }}
			fillOpacity={0.85}
			borderColor={{ theme: 'background' }}
			defs={[
				{
					id: 'dots',
					type: 'patternDots',
					background: 'inherit',
					color: '#2c998f',
					size: 4,
					padding: 2,
					stagger: true,
				},
				{
					id: 'squares',
					type: 'patternSquares',
					background: 'inherit',
					color: '#e4c912',
					size: 6,
					padding: 2,
					stagger: true,
				},
			]}
			fill={[
				{
					match: {
						id: 'Paul',
					},
					id: 'dots',
				},
				{
					match: {
						id: 'Marcel',
					},
					id: 'squares',
				},
			]}
			dotSize={8}
			dotColor={{ from: 'color' }}
			dotBorderWidth={2}
			dotBorderColor={{
				from: 'color',
				modifiers: [['darker', 0.7]],
			}}
			legends={[
				{
					anchor: 'bottom-right',
					direction: 'column',
					translateX: 100,
					itemWidth: 80,
					itemHeight: 20,
					itemTextColor: '#999999',
					symbolSize: 12,
					symbolShape: 'circle',
					effects: [
						{
							on: 'hover',
							style: {
								itemTextColor:
									theme.colorScheme === 'light'
										? theme.black
										: theme.white,
							},
						},
					],
				},
			]}
		/>
	) : (
		<Alert
			color="red"
			title="Not enough data!"
			icon={<BiError />}
			variant="filled"
			radius="lg"
			p="xl"
		>
			You need to have more days of study to view this chart.
		</Alert>
	);
}
