import {
	Badge,
	Button,
	ButtonProps,
	Group,
	MantineSize,
	MediaQuery,
	Stack,
	Text,
	useMantineTheme,
} from '@mantine/core';
import React, { MouseEvent } from 'react';

import { IsCorrect } from './IsCorrect';
import { BiFastForward } from 'react-icons/bi';
import { useHotkeys, useMediaQuery } from '@mantine/hooks';
import { AnswerType } from '.';
import { moveToBox } from 'flashcard/moveToBox';

type Props = {
	onAdvance: () => void;
	answer: AnswerType;
};

export function ReviewAnswer({
	answer: { answer, flashcard, isCorrect, side },
	onAdvance,
}: Props) {
	useHotkeys([
		['enter', onAdvance],
		['space', onAdvance],
	]);

	const advanceProps: ButtonProps & {
		onClick: (e: MouseEvent) => void;
	} = {
		variant: 'light',
		color: 'teal',
		onClick: onAdvance,
		radius: 'md',
		leftIcon: <BiFastForward size={24} />,
	};

	const AnswerText = ({ size }: { size: MantineSize }) => (
		<Text
			size={size}
			lh={1.75}
			lts={1.1}
		>
			You answered that the word(s){' '}
			{flashcard[side === 'FRONT' ? 'front' : 'back'].map((word, i) => (
				<React.Fragment key={i}>
					{i > 0 ? (
						<Text
							mx="sm"
							span
							fw={700}
						>
							AND
						</Text>
					) : null}
					<Badge
						color="green"
						size="lg"
						key={i}
					>
						{word}
					</Badge>
				</React.Fragment>
			))}{' '}
			{flashcard[side === 'FRONT' ? 'front' : 'back'].length > 1
				? 'translate'
				: 'translates'}{' '}
			to{' '}
			<Badge
				color="yellow"
				size="lg"
			>
				{answer}
			</Badge>{' '}
		</Text>
	);

	const CorrectText = ({ size }: { size: MantineSize }) => (
		<Text
			size={size}
			color="dimmed"
			mt="sm"
		>
			The correct answer is:{' '}
			{flashcard[side === 'FRONT' ? 'back' : 'front'].map((word, i) => (
				<React.Fragment key={i}>
					{i > 0 ? (
						<Text
							fw={700}
							mx="sm"
							span
						>
							OR
						</Text>
					) : null}
					<Badge
						color="pink"
						size="lg"
						key={i}
					>
						{word}
					</Badge>
				</React.Fragment>
			))}{' '}
		</Text>
	);

	const theme = useMantineTheme();
	const atLeastSmall = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

	return (
		<Stack>
			<IsCorrect
				isCorrect={isCorrect}
				oldBox={flashcard.box.boxNumber}
				newBox={moveToBox(isCorrect, flashcard.box.boxNumber)}
			/>
			<AnswerText size={atLeastSmall ? 'xl' : 'lg'} />
			<CorrectText size={atLeastSmall ? 'lg' : 'md'} />
			<Group
				position="right"
				mt="lg"
			>
				<MediaQuery
					smallerThan={'sm'}
					styles={{ display: 'none' }}
				>
					<Button
						{...advanceProps}
						size="lg"
					>
						Advance
					</Button>
				</MediaQuery>
				<MediaQuery
					largerThan={'sm'}
					styles={{ display: 'none' }}
				>
					<Button {...advanceProps}>Advance</Button>
				</MediaQuery>
			</Group>
		</Stack>
	);
}
