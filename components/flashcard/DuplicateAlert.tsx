import { Alert, Text } from '@mantine/core';
import { BiAlarmExclamation } from 'react-icons/bi';

type Props = { handleClose: () => void };

export const closeButtonLabel = 'Close duplicate flashcard alert';

export function DuplicateAlert({ handleClose }: Props) {
	return (
		<Alert
			icon={<BiAlarmExclamation size={32} />}
			color="red"
			withCloseButton
			closeButtonLabel={closeButtonLabel}
			onClose={handleClose}
			title="Duplicate flashcard"
		>
			<Text size="lg">
				This card would duplicate one of your other cards.
			</Text>
			<Text
				size="sm"
				color="dimmed"
				mt="xs"
			>
				You can close this warning to ignore the duplicate or you can
				change your values.
			</Text>
		</Alert>
	);
}
