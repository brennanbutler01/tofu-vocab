import { Alert, Text, useMantineTheme } from '@mantine/core';
import { linearGradientDef } from '@nivo/core';
import { Point, ResponsiveLine, LineSeries } from '@nivo/line';
import { BiError } from 'react-icons/bi';
import { useAttemptsPerDaySWR } from 'user/swr';

type Props = {
	onClick: (d: Point<LineSeries>) => void;
};

export default function ActivityPerDayLine({ onClick }: Props) {
	const { attemptsPerDay } = useAttemptsPerDaySWR();
	const theme = useMantineTheme();

	return attemptsPerDay && attemptsPerDay?.length >= 2 ? (
		<ResponsiveLine
			data={
				attemptsPerDay?.reduce<LineSeries[]>(
					(acc, curr) => {
						const [correct, incorrect] = acc;
						let updatedCorrect = {
							...correct,
							data: [
								...correct.data,
								{ x: curr.date, y: curr.correct },
							],
						};
						let updatedIncorrect = {
							...incorrect,
							data: [
								...incorrect.data,
								{ x: curr.date, y: curr.incorrect },
							],
						};
						return [updatedCorrect, updatedIncorrect];
					},
					[
						{ id: 'correct', data: [] },
						{ id: 'incorrect', data: [] },
					],
				) || []
			}
			margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
			xScale={{ type: 'point' }}
			enableArea={true}
			yScale={{
				type: 'linear',
				stacked: true,
			}}
			curve={'linear'}
			defs={[
				linearGradientDef('gradientA', [
					{ offset: 0, color: 'inherit' },
					{ offset: 100, color: 'inherit', opacity: 0 },
				]),
			]}
			colors={{ scheme: 'dark2' }}
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
			fill={[{ match: '*', id: 'gradientA' }]}
			yFormat=" >-.2f"
			axisTop={null}
			axisRight={null}
			pointSize={10}
			pointBorderWidth={2}
			pointBorderColor={{ from: 'serieColor' }}
			pointLabelYOffset={-12}
			useMesh={true}
			legends={[
				{
					itemTextColor:
						theme.colorScheme === 'dark' ? theme.white : 'initial',
					anchor: 'bottom-right',
					direction: 'column',
					justify: false,
					translateX: 100,
					translateY: 0,
					itemsSpacing: 0,
					itemDirection: 'left-to-right',
					itemWidth: 80,
					itemHeight: 20,
					itemOpacity: 0.75,
					symbolSize: 12,
					symbolShape: 'circle',
					symbolBorderColor: 'rgba(0, 0, 0, .5)',
					effects: [
						{
							on: 'hover',
							style: {
								itemBackground: 'rgba(0, 0, 0, .03)',
								itemOpacity: 1,
							},
						},
					],
				},
			]}
			onClick={datum => {
				if ('seriesId' in datum) onClick(datum);
			}}
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
