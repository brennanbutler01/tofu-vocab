import { Button } from '@mantine/core';
import { StudySides } from '@prisma/client';

type Props = {
	setSide: () => void;
	side: StudySides;
};

export function SideButtons({ setSide, side }: Props) {
	return (
		<Button.Group>
			<Button
				className={side === 'FRONT' ? 'selected-button' : ''}
				onClick={setSide}
				variant={side === 'FRONT' ? 'light' : 'default'}
			>
				front
			</Button>
			<Button
				className={side === 'BACK' ? 'selected-button' : ''}
				onClick={setSide}
				variant={side === 'BACK' ? 'light' : 'default'}
			>
				back
			</Button>
		</Button.Group>
	);
}
