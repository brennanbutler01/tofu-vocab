import { Flashcard, Prisma } from '@prisma/client';
import { FlashcardCrud } from '.';
import prisma from 'prisma/db/index';
import http from 'utils/http';
import { selectFlashcardForStudy } from 'flashcard/prepareFlashcardForStudy';

const flashcardsWithBox = Prisma.validator<Prisma.FlashcardDefaultArgs>()({
	include: {
		box: true,
		attempts: true,
	},
});

export type FlashcardWithBox = Prisma.FlashcardGetPayload<
	typeof flashcardsWithBox
>;

class FlashcardGetOne extends FlashcardCrud {
	constructor() {
		super();
	}

	//make a fetch GET request to the api and return unique flashcard
	apiGetOneFlashcard = async (id: string) =>
		await http.get<Flashcard>(this.SINGULAR_ENDPOINT + id);

	//get the unique flashcard from prisma
	dbGetOneFlashcard = async (id: string) =>
		await prisma.flashcard.findUnique({ where: { id } });

	//look through our cards and return one that we actually need to study if it exists
	getFlashcardToStudy = selectFlashcardForStudy;
}

const flashcardGet = new FlashcardGetOne();
export default flashcardGet;
