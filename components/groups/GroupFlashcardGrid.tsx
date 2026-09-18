import { Flex, SimpleGrid } from '@mantine/core';
import { GroupFlashcard } from '@prisma/client';
import GroupFlashcardItem from './GroupFlashcardItem';
import GroupFlashcardsEmpty from './GroupFlashcardsEmpty';

type Props = {
	groupCards: GroupFlashcard[];
	selectedCards: string[];
	setSelectedCards: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function GroupFlashcardGrid({
	groupCards,
	selectedCards,
	setSelectedCards,
}: Props) {
	return (
		<SimpleGrid
			cols={1}
			breakpoints={[
				{ cols: 1, maxWidth: 'xs' },
				{ cols: 2, minWidth: 'sm' },
			]}
		>
			{groupCards?.length === 0 ? (
				<GroupFlashcardsEmpty />
			) : (
				groupCards?.map(c => (
					<GroupFlashcardItem
						flashcard={c}
						key={c.id}
						selectedCards={selectedCards}
						setSelectedCards={setSelectedCards}
					/>
				))
			)}
		</SimpleGrid>
	);
}
