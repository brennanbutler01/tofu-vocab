import { FlashcardSources } from '@prisma/client';
import { FlashcardWithBox } from './crud/getOne';

//filter the flashcards by our user source - this filters down the cards we are studying
export default function filterCardsBySource(
	flashcards: FlashcardWithBox[],
	source: FlashcardSources,
) {
	return flashcards?.filter(flashcard => {
		console.log(flashcard, source);
		switch (source) {
			case 'BOX4':
				return flashcard.box.boxNumber === 4;
			case 'IN_PROGRESS':
				return (
					flashcard.box.boxNumber < 4 && flashcard.attempts.length > 0
				);
			case 'NOT_STUDIED':
				return flashcard.attempts.length === 0;
			default:
				return true;
		}
	});
}
