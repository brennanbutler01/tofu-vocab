import { Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';
import { BiCaretRight } from 'react-icons/bi';

type Props = {
	oldBox: number;
	newBox: number;
};

//component is used to show our old and new boxes for a flashcard
export function BoxTransition({ oldBox, newBox }: Props) {
	const theme = useMantineTheme();
	const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
	const isXl = useMediaQuery(`(min-width: ${theme.breakpoints.xl})`);
	const from = (
		<>
			{' '}
			<Text
				color="dimmed"
				size={isXl ? 'xl' : 'md'}
			>
				From{' '}
			</Text>
			<Text
				size={isXs ? 'xl' : 'lg'}
				weight={900}
			>
				{oldBox + 1}
			</Text>
		</>
	);
	const to = (
		<>
			<Text
				color="dimmed"
				size={isXl ? 'xl' : 'md'}
			>
				To
			</Text>
			<Text
				size={isXs ? 'xl' : 'lg'}
				weight={900}
			>
				{newBox + 1}
			</Text>
		</>
	);

	const TextWrapper = isXs ? Stack : Group;

	return (
		<Stack>
			<Text
				color="dimmed"
				size="md"
			>
				Change in Boxes
			</Text>
			<Group mt="lg">
				<TextWrapper spacing={'xs'}>{from}</TextWrapper>
				<BiCaretRight
					size={32}
					color={theme.colors.dark[0]}
				/>
				<TextWrapper spacing="xs">{to}</TextWrapper>
			</Group>
			<Text
				color="dimmed"
				size="xs"
			>
				There are five boxes: 1 is the first box and 5 is the last box.
			</Text>
		</Stack>
	);
}
