import { Card, Grid, Group, Stack } from '@mantine/core';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { useState } from 'react';
import { FlashcardFlipButton } from './FlashcardFlipButton';
import { FlashcardMenu } from './FlashcardMenu';
import FlashcardOrigin from './FlashcardOrigin';
import { FlashcardSide } from './FlashcardSide';

type Props = { flashcard: FlashcardWithBox };

export type FlashcardSides = 'front' | 'back';

export const FlashcardItem = ({ flashcard }: Props) => {
	const [side, setSide] = useState<FlashcardSides>('front');
	return (
		<Card
			className="card"
			withBorder
			radius={'md'}
			shadow="md"
			key={flashcard.id}
		>
			<Stack>
				<Grid>
					<Grid.Col span={9}>
						<FlashcardSide
							side={side}
							value={flashcard[side]}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<Group
							ml="md"
							align="start"
							position="right"
						>
							<FlashcardMenu flashcard={flashcard} />
							<FlashcardFlipButton
								onClick={() =>
									setSide(side === 'front' ? 'back' : 'front')
								}
							/>
						</Group>
					</Grid.Col>
				</Grid>
				<FlashcardOrigin origin={flashcard.origin} />
			</Stack>
		</Card>
	);
};
