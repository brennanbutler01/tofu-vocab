import { Flashcard } from '@prisma/client';
import { trimAndLowercase } from 'utils/trimAndLowercase';
import { DuplicateFilters } from './findDuplicates';

function someItemMatches(itemsToCheck: string[], searchValue: string[]) {
	return itemsToCheck.some(item =>
		searchValue.some(
			search => trimAndLowercase(search) === trimAndLowercase(item),
		),
	);
}

//check to see if the itemToCheck duplicates the searchFront, searchBack
export const isFlashcardDuplicate = (
	searchFront: string[],
	searchBack: string[],
	itemToCheck: Flashcard,
	duplicateFilter: DuplicateFilters,
) => {
	const frontMatches = someItemMatches(itemToCheck.front, searchFront);
	const backMatches = someItemMatches(itemToCheck.back, searchBack);
	const frontMatchesBack = someItemMatches(itemToCheck.front, searchBack);
	const backMatchesFront = someItemMatches(itemToCheck.back, searchFront);

	//if we are looking for a FULL match, both front and back must match
	return duplicateFilter === 'FULL'
		? frontMatches && backMatches
		: //else it is ookay if it is just partial
		  frontMatches || backMatches || frontMatchesBack || backMatchesFront;
};
