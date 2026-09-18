import { Flashcard } from '@prisma/client';
import { isFlashcardDuplicate } from './isFlashcardDuplicate';

export enum DuplicateFilters {
	FULL = 'FULL',
	PARTIAL = 'PARTIAL',
}

// this function is used to look through our flashcards and let us know if we have any duplicates
export const findDuplicates = (
	flashcards: Flashcard[],
	cardToSearchFor: Flashcard,
	match = DuplicateFilters.FULL,
) =>
	flashcards.reduce<Flashcard[]>((acc, curr) => {
		//if it matches our search & is not the same card that we are using to define our search, add it as a duplicate.
		if (
			curr.id !== cardToSearchFor.id &&
			isFlashcardDuplicate(
				cardToSearchFor.front,
				cardToSearchFor.back,
				curr,
				match,
			)
		) {
			return [...acc, curr];
		}
		return acc;
	}, []);
