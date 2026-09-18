import { GroupFlashcard } from '@prisma/client';
import { trimAndLowercase } from 'utils/trimAndLowercase';
import { FlashcardWithBox } from './crud/getOne';

// Preserve the caller's card type while searching only the two text sides.
export function searchFlashcards<T extends { front: string[]; back: string[] }>(
	flashcards: T[],
	search: string,
): T[] {
	return search
		? flashcards.filter(
				({ front, back }) =>
					front.some(val =>
						trimAndLowercase(val).includes(
							trimAndLowercase(search),
						),
					) ||
					back.some(val =>
						trimAndLowercase(val).includes(
							trimAndLowercase(search),
						),
					),
		  )
		: //if we don't have any search, return all of the cards
		  flashcards;
}
