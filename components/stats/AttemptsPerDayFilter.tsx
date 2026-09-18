import { Button } from '@mantine/core';
import React from 'react';

type Props = {
	filter: 'calendar' | 'stream' | 'line';
	setFilter: (filter: 'calendar' | 'stream' | 'line') => void;
};

export default function AttemptsPerDayFilter({ filter, setFilter }: Props) {
	return (
		<Button.Group>
			<Button
				radius="md"
				variant={filter === 'calendar' ? 'filled' : 'light'}
				onClick={() => setFilter('calendar')}
			>
				calendar
			</Button>
			<Button
				radius="md"
				variant={filter === 'line' ? 'filled' : 'light'}
				onClick={() => setFilter('line')}
			>
				line
			</Button>
			<Button
				radius="md"
				variant={filter === 'stream' ? 'filled' : 'light'}
				onClick={() => setFilter('stream')}
			>
				stream
			</Button>
		</Button.Group>
	);
}
