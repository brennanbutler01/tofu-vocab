import { Button } from '@mantine/core';
import React from 'react';
import { AiFillFunnelPlot } from 'react-icons/ai';
import { IoPieChartSharp } from 'react-icons/io5';

type Props = {
	chart: 'funnel' | 'pie';
	setChart: React.Dispatch<React.SetStateAction<'pie' | 'funnel'>>;
};

export default function CardsPerBoxChartTypeGroup({ chart, setChart }: Props) {
	return (
		<Button.Group>
			<Button
				radius="md"
				variant={chart === 'funnel' ? 'filled' : 'light'}
				leftIcon={<AiFillFunnelPlot />}
				onClick={() => setChart('funnel')}
			>
				funnel
			</Button>
			<Button
				radius="md"
				variant={chart === 'pie' ? 'filled' : 'light'}
				leftIcon={<IoPieChartSharp />}
				onClick={() => setChart('pie')}
			>
				pie
			</Button>
		</Button.Group>
	);
}
