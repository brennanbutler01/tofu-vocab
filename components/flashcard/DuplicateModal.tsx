import { Badge, Text } from '@mantine/core';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { FlashcardList } from './FlashcardList';

type Props = {
	cardToCreate: { front: string; back: string };
	duplicates: FlashcardWithBox[];
};
export function DuplicateModal({ duplicates, cardToCreate }: Props) {
	return (
		<div>
			<Text>
				These are your duplicate items for{' '}
				<Badge>Front: {cardToCreate.front}</Badge>:
			</Text>
			<FlashcardList
				searching={false}
				data={duplicates}
			/>
			{/* <List>
				{duplicates?.map(duplicateFlashcard => (
					<List.Item key={duplicateFlashcard.id}>
						Front: <Badge>{duplicateFlashcard.front}</Badge>
						Back: <Badge>{duplicateFlashcard.back}</Badge>
					</List.Item>
				))}
			</List> */}
		</div>
	);
}
