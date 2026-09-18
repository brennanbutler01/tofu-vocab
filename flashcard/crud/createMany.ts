import { FlashcardCrud } from '.';
import http from 'utils/http';
import prisma from 'prisma/db/index';
import { Prisma } from '@prisma/client';
import { FlashcardWithBox } from './getOne';

class CreateManyFlashcards extends FlashcardCrud {
	CREATE_MANY_API = '/api/flashcards/createMany';
	constructor() {
		super();
	}

	apiCreateManyFlashcards = async (data: Prisma.FlashcardCreateManyInput[]) =>
		await http.post<FlashcardWithBox[], Prisma.FlashcardCreateManyInput[]>(
			this.CREATE_MANY_API,
			data,
		);

	dbCreateManyFlashcards = async (data: Prisma.FlashcardCreateManyInput[]) =>
		await prisma?.flashcard?.createMany({ data, skipDuplicates: true });
}
const createManyFlashcards = new CreateManyFlashcards();
export default createManyFlashcards;
