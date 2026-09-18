import {
	ActionIcon,
	Group,
	Menu,
	Stack,
	Text,
	useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React, { useState } from 'react';
import { BiVolume } from 'react-icons/bi';
import { IAPIGetWordResponse } from 'words/get';
import { PronunciationItem } from './PronunciationItem';

type Props = { definition: IAPIGetWordResponse['definition'] };

export default function PronunciationMenu({ definition }: Props) {
	const [playingOne, setPlayingOne] = useState(false);
	const theme = useMantineTheme();
	const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

	const pronunciations = Array.isArray(definition)
		? definition[0]?.phonetics?.reduce<string[]>((acc, curr) => {
				if (curr?.audio) {
					return [...acc, curr?.audio];
				}
				return acc;
		  }, [])
		: undefined;

	return (
		<Stack mt="lg">
			<>
				{pronunciations?.length || 0 > 0 ? (
					<>
						<Text>Pronunciations</Text>
						<Menu
							closeOnItemClick={false}
							shadow="md"
							radius="md"
							styles={{
								itemLabel: {
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								},
							}}
							width={275}
							withinPortal
							withArrow
							position={isXs ? 'bottom-end' : 'right'}
						>
							<Group spacing="xs">
								<Menu.Target>
									<ActionIcon
										size="lg"
										radius="md"
										variant="light"
									>
										<BiVolume size={18} />
									</ActionIcon>
								</Menu.Target>
								<Text
									size="sm"
									color="dimmed"
								>
									listen to recordings
								</Text>
							</Group>
							<Menu.Dropdown>
								{pronunciations?.map((source, i, arr) => (
									<React.Fragment key={i}>
										<PronunciationItem
											source={source}
											playingOne={playingOne}
											setPlayingOne={setPlayingOne}
										/>
										{i > 0 && i !== arr.length - 1 ? (
											<Menu.Divider />
										) : null}
									</React.Fragment>
								))}
							</Menu.Dropdown>
						</Menu>
					</>
				) : null}
			</>
		</Stack>
	);
}
