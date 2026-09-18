import { useMantineTheme } from '@mantine/core';
import { ResponsiveFunnel } from '@nivo/funnel';
import { ICountPerBox } from 'user/crud/stats';

type Props = { cardsPerBox: ICountPerBox[]; setBox: (box: number) => void };
export default function CardsPerBoxFunnel({ cardsPerBox, setBox }: Props) {
	const theme = useMantineTheme();
	return (
		<ResponsiveFunnel
			data={cardsPerBox
				?.map(b => ({
					id: b.boxNumber,
					label: 'Box ' + b.boxNumber,
					value: b.count,
				}))
				.reverse()}
			theme={{
				tooltip: {
					basic: {
						color: theme.black,
					},
				},
			}}
			margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
			valueFormat=">-.4d"
			colors={{ scheme: 'pastel2' }}
			borderWidth={20}
			labelColor={{
				from: 'color',
				modifiers: [['darker', 3]],
			}}
			beforeSeparatorLength={100}
			beforeSeparatorOffset={20}
			afterSeparatorLength={100}
			afterSeparatorOffset={20}
			currentPartSizeExtension={10}
			currentBorderWidth={40}
			motionConfig="wobbly"
			onClick={d => setBox(d.data.id)}
		/>
	);
}
