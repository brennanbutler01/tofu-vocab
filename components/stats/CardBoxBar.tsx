import { Text, useMantineTheme } from '@mantine/core';
import { BarDatum, ResponsiveBar } from '@nivo/bar';

type Props = {
	data: BarDatum[];
};

export default function CardBoxBar({ data }: Props) {
	const theme = useMantineTheme();

	return data?.length > 0 ? (
		<ResponsiveBar
			data={data}
			keys={['correct', 'incorrect']}
			indexBy="card"
			margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
			padding={0.3}
			valueScale={{ type: 'linear' }}
			indexScale={{ type: 'band', round: true }}
			colors={{ scheme: 'pastel2' }}
			theme={{
				text: {
					fill:
						theme.colorScheme === 'dark'
							? theme.white
							: theme.black,
				},
				tooltip: {
					basic: {
						color: theme.black,
					},
				},
			}}
			defs={[
				{
					id: 'dots',
					type: 'patternDots',
					background: 'inherit',
					color: '#38bcb2',
					size: 4,
					padding: 1,
					stagger: true,
				},
				{
					id: 'lines',
					type: 'patternLines',
					background: 'inherit',
					color: '#eed312',
					rotation: -45,
					lineWidth: 6,
					spacing: 10,
				},
			]}
			fill={[
				{
					match: {
						id: 'Box 0',
					},
					id: 'dots',
				},
				{
					match: {
						id: 'sandwich',
					},
					id: 'lines',
				},
			]}
			borderColor={{
				from: 'color',
				modifiers: [['darker', 1.6]],
			}}
			axisTop={null}
			axisRight={null}
			axisBottom={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: 'flashcard',
				legendPosition: 'middle',
				legendOffset: 40,
			}}
			axisLeft={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: 'studied',
				legendPosition: 'middle',
				legendOffset: -50,
			}}
			labelSkipWidth={12}
			labelSkipHeight={12}
			labelTextColor={{
				from: 'color',
				modifiers: [['darker', 1.6]],
			}}
			legends={[
				{
					dataFrom: 'keys',
					anchor: 'bottom-right',
					direction: 'column',
					justify: false,
					translateX: 120,
					translateY: 0,
					itemsSpacing: 2,
					itemWidth: 100,
					itemHeight: 20,
					itemDirection: 'left-to-right',
					itemOpacity: 0.85,
					symbolSize: 20,
					effects: [
						{
							on: 'hover',
							style: {
								itemOpacity: 1,
							},
						},
					],
				},
			]}
			role="application"
			ariaLabel="Nivo bar chart demo"
			barAriaLabel={function (e) {
				return (
					e.id +
					': ' +
					e.formattedValue +
					' in country: ' +
					e.indexValue
				);
			}}
		/>
	) : (
		<Text>You need to study more days to view this chart.</Text>
	);
}
