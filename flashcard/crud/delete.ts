import { Flashcard, LeitnerBox, StudyAttempt } from '@prisma/client';
import { FlashcardCrud } from '.';
import http from 'utils/http';
import prisma from 'prisma/db/index';
import { SWRMutationResponse } from 'swr/mutation';
import { FlashcardWithBox } from './getOne';

interface IDelete {
	id: string;
	trigger: SWRMutationResponse<
		FlashcardWithBox[],
		Error,
		string,
		string
	>['trigger'];
}

class FlashcardDelete extends FlashcardCrud {
	constructor() {
		super();
	}

	//make the fetch DELETE call to the api to delete the flashcard
	apiDeleteFlashcard = async (id: string) =>
		await http.delete<Flashcard>(this.SINGULAR_ENDPOINT + id);

	//make the prisma delete request
	dbDeleteFlashcard = async (id: string) =>
		await prisma.flashcard.delete({ where: { id } });

	//delete the flashcard from the database and the cache
	deleteFlashcard = async ({ id, trigger }: IDelete) => {
		await trigger(id, {
			optimisticData: current => {
				let currArray = current || [];
				return currArray?.filter(card => card.id !== id);
			},
		});
	};
}

const flashcardDelete = new FlashcardDelete();
export default flashcardDelete;
