import { Flex, Stack, Text } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { FlashcardSources, User } from '@prisma/client';
import { useUserSWR } from 'user/swr';
import { ModalTitle } from '../ModalTitle';
import SelectSource from './SelectSource';

type Props = { center?: boolean; onSourceChange: () => void };

function printSource(source?: FlashcardSources) {
	let sourceName = '';
	switch (source) {
		case FlashcardSources.BOX4:
			sourceName = 'Completed cards';
			break;
		case FlashcardSources.IN_PROGRESS:
			sourceName = 'Cards in progress';
			break;
		case FlashcardSources.NOT_STUDIED:
			sourceName = 'Cards not studied';
			break;
		default:
			sourceName = 'All cards';
			break;
	}
	return sourceName;
}

export default function ConfigureSource({ center, onSourceChange }: Props) {
	const { user } = useUserSWR({});
	return (
		<Flex
			direction={'column'}
			p="sm"
		>
			<Text
				align={center ? 'center' : 'end'}
				sx={{ cursor: 'pointer' }}
				color="teal"
				onClick={() =>
					openModal({
						shadow: 'lg',
						radius: 'md',
						centered: true,
						withCloseButton: false,
						title: <ModalTitle text="Study Source" />,
						children: (
							<SelectSource
								user={user as User}
								onSubmit={onSourceChange}
							/>
						),
					})
				}
			>
				Configure source
			</Text>
			<Text
				size="sm"
				color="dimmed"
			>
				Currently studying: {printSource(user?.flashcardSource)}
			</Text>
		</Flex>
	);
}
