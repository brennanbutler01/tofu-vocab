import { useMantineTheme } from '@mantine/core';
import { ResponsivePie } from '@nivo/pie';
import { ICountPerBox } from 'user/crud/stats';

type Props = { cardsPerBox: ICountPerBox[]; setBox: (box: number) => void };
export default function CardsPerBoxPie({ cardsPerBox, setBox }: Props) {
	const theme = useMantineTheme();
	return (
		<ResponsivePie
			data={cardsPerBox?.map(b => ({
				id: 'Box ' + b.boxNumber,
				value: b.count,
			}))}
			theme={{
				tooltip: {
					basic: {
						color: theme.black,
					},
				},
			}}
			margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
			innerRadius={0.5}
			padAngle={0.7}
			cornerRadius={3}
			activeOuterRadiusOffset={8}
			borderWidth={1}
			borderColor={{
				from: 'color',
				modifiers: [['darker', 0.2]],
			}}
			colors={{ scheme: 'pastel2' }}
			arcLinkLabelsSkipAngle={10}
			arcLinkLabelsThickness={2}
			arcLinkLabelsColor={{ from: 'color' }}
			arcLabelsSkipAngle={10}
			arcLabelsTextColor={{
				from: 'color',
				modifiers: [['darker', 2]],
			}}
			defs={[
				{
					id: 'dots',
					type: 'patternDots',
					background: 'inherit',
					color: 'rgba(255, 255, 255, 0.3)',
					size: 4,
					padding: 1,
					stagger: true,
				},
				{
					id: 'lines',
					type: 'patternLines',
					background: 'inherit',
					color: 'rgba(255, 255, 255, 0.3)',
					rotation: -45,
					lineWidth: 6,
					spacing: 10,
				},
			]}
			fill={[
				{
					match: {
						id: 'ruby',
					},
					id: 'dots',
				},
				{
					match: {
						id: 'c',
					},
					id: 'dots',
				},
				{
					match: {
						id: 'go',
					},
					id: 'dots',
				},
				{
					match: {
						id: 'python',
					},
					id: 'dots',
				},
				{
					match: {
						id: 'scala',
					},
					id: 'lines',
				},
				{
					match: {
						id: 'lisp',
					},
					id: 'lines',
				},
				{
					match: {
						id: 'elixir',
					},
					id: 'lines',
				},
				{
					match: {
						id: 'javascript',
					},
					id: 'lines',
				},
			]}
			arcLinkLabelsTextColor={
				theme.colorScheme === 'dark' ? theme.white : theme.black
			}
			legends={[
				{
					anchor: 'bottom',
					direction: 'row',
					justify: false,
					translateX: 0,
					translateY: 56,
					itemsSpacing: 0,
					itemWidth: 100,
					itemHeight: 18,
					itemTextColor: '#999',
					itemDirection: 'left-to-right',
					itemOpacity: 1,
					symbolSize: 18,
					symbolShape: 'circle',
					effects: [
						{
							on: 'hover',
							style: {
								itemTextColor:
									theme.colorScheme === 'dark'
										? theme.white
										: theme.black,
							},
						},
					],
				},
			]}
			onClick={d => setBox(parseInt(d.id.toString().split(' ')[1]))}
		/>
	);
}
