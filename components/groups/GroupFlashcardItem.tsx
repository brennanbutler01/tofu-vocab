import { Card, Checkbox, Grid, Group } from '@mantine/core';
import { GroupFlashcard, Prisma } from '@prisma/client';
import { useState } from 'react';
import { FlashcardFlipButton } from '../flashcard/FlashcardFlipButton';
import { FlashcardSides } from '../flashcard/FlashcardItem';
import { FlashcardSide } from '../flashcard/FlashcardSide';

type Props = {
	flashcard: GroupFlashcard;
	selectedCards: string[];
	setSelectedCards: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function GroupFlashcardItem({
	flashcard,
	selectedCards,
	setSelectedCards,
}: Props) {
	const [side, setSide] = useState<FlashcardSides>('front');

	return (
		<Card
			className="card"
			withBorder
			radius={'md'}
			shadow="md"
			key={flashcard.id}
		>
			<Grid>
				<Grid.Col span={9}>
					<FlashcardSide
						side={side}
						value={flashcard[side] as string[]}
					/>
				</Grid.Col>
				<Grid.Col span={3}>
					<Group
						ml="md"
						align="start"
						position="right"
					>
						<FlashcardFlipButton
							onClick={() =>
								setSide(side === 'front' ? 'back' : 'front')
							}
						/>
						<Checkbox
							checked={selectedCards.includes(flashcard.id)}
							size="sm"
							radius={'sm'}
							onChange={e => {
								if (selectedCards.includes(flashcard.id)) {
									setSelectedCards(
										selectedCards.filter(
											c => c !== flashcard.id,
										),
									);
								} else {
									setSelectedCards([
										...selectedCards,
										flashcard.id,
									]);
								}
							}}
						/>
					</Group>
				</Grid.Col>
			</Grid>
		</Card>
	);
}
