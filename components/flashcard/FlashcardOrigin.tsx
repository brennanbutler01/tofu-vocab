import { Flex, Group, Text, ThemeIcon } from '@mantine/core';
import { FlashcardOrigins } from '@prisma/client';
import { IoPeople, IoPerson, IoCloud } from 'react-icons/io5';

type Props = { origin: FlashcardOrigins };

export default function FlashcardOrigin({ origin }: Props) {
	const config = {
		[FlashcardOrigins.GROUP]: {
			icon: <IoPeople size={10} />,
			text: 'group',
			color: 'pink',
		},
		[FlashcardOrigins.USER]: {
			icon: <IoPerson size={10} />,
			text: 'user',
			color: 'indigo',
		},
		[FlashcardOrigins.RANDOM_WORD]: {
			icon: <IoCloud size={10} />,
			text: 'word',
			color: 'orange',
		},
	};
	return (
		<Flex
			direction={'column'}
			gap="sm"
			sx={theme => ({
				borderTop: `1px solid ${
					theme.colorScheme === 'dark'
						? theme.colors.dark[4]
						: theme.colors.gray[1]
				}`,
				paddingTop: theme.spacing.sm,
			})}
		>
			<Text
				size="xs"
				color="dimmed"
				fw={300}
			>
				Source:
			</Text>
			<Group>
				<ThemeIcon
					variant="light"
					color={config[origin].color}
					size="md"
					radius="md"
				>
					{config[origin].icon}
				</ThemeIcon>
				<Text
					size="xs"
					color="dimmed"
					fw={300}
				>
					{config[origin].text}
				</Text>
			</Group>
		</Flex>
	);
}
