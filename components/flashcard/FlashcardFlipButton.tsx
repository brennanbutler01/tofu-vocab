import { ActionIcon } from '@mantine/core';
import { BiRotateRight } from 'react-icons/bi';

type Props = { onClick: () => void };

export function FlashcardFlipButton({ onClick }: Props) {
	return (
		<ActionIcon
			onClick={onClick}
			title="flip-card-button"
		>
			<BiRotateRight />
		</ActionIcon>
	);
}
