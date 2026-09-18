import { FlashcardCrud } from '.';
import http from 'utils/http';
import prisma from 'prisma/db';
import { FlashcardWithBox } from './getOne';
import { Flashcard, FlashcardSources } from '@prisma/client';

class FlashcardsGetMany extends FlashcardCrud {
	constructor() {
		super();
	}

	//get the full cards that we have not studied yet
	dbGetFlashcardsNotYetStudied = async (userId: string) =>
		await prisma?.flashcard?.findMany({
			where: {
				AND: [
					{
						attempts: {
							none: {
								userId,
							},
						},
					},
					{ userId },
				],
			},
			include: {
				attempts: true,
				box: true,
			},
		});

	//get the full cards that are in box 4 and finished
	dbGetFlashcardsInBox4 = async (userId: string) =>
		await prisma?.flashcard?.findMany({
			where: {
				AND: [{ userId }, { box: { boxNumber: 4 } }],
			},
			include: {
				attempts: true,
				box: true,
			},
		});

	//get the full cards that we are studying  and arent finished yet
	dbGetFlashcardsInProgress = async (userId: string) =>
		await prisma?.flashcard?.findMany({
			where: {
				AND: [
					{ userId },
					{ attempts: { some: { userId } } },
					{ box: { boxNumber: { lt: 4 } } },
				],
			},
			include: {
				box: true,
				attempts: true,
			},
		});

	//make our fetch GET request to the flashcards api and return them all
	apiGetFlashcards = async (source: FlashcardSources) =>
		await http.get<FlashcardWithBox[]>(this.API_ENDPOINT + `/${source}`);

	//get the flashcards from prisma
	dbGetFlashcards = async (userId: string) =>
		await prisma?.flashcard.findMany({
			where: {
				createdBy: {
					id: userId,
				},
			},
			include: {
				attempts: true,
				box: true,
			},
			orderBy: {
				created_at: 'asc',
			},
		});

	//parse sources and return our fetcher
	getFlashcardFetcher = async (source: FlashcardSources, userId: string) => {
		switch (source) {
			case 'ALL':
				return await this.dbGetFlashcards(userId);
			case 'BOX4':
				return await this.dbGetFlashcardsInBox4(userId);
			case 'IN_PROGRESS':
				return await this.dbGetFlashcardsInProgress(userId);
			case 'NOT_STUDIED':
				return await this.dbGetFlashcardsNotYetStudied(userId);
		}
	};

	//get flashcards that have either a front or back that matches one of our fronts or backs....
	dbGetDuplicateCards = async (flashcard: Flashcard, userId: string) => {
		return await prisma?.flashcard?.findMany({
			where: {
				AND: [
					{ userId: userId },
					{
						OR: [
							{
								front: {
									hasSome: flashcard.front,
								},
							},
							{ back: { hasSome: flashcard.back } },
						],
					},
				],
			},
		});
	};

	//get duplicate cards from api
	apiGetDuplicateCards = async (id: string) =>
		await http.get<Flashcard[]>('/api/flashcard/findDuplicates/' + id);

	//collect front and back of cards
	reduceDuplicateFrontBack = (flashcards: Flashcard[]) =>
		flashcards?.reduce<{ front: string[]; back: string[] }>(
			(acc, curr) => {
				return {
					back: [...acc.back, ...curr.back],
					front: [...acc.front, ...curr.front],
				};
			},
			{ back: [], front: [] },
		);
}

const flashcardsGet = new FlashcardsGetMany();
export default flashcardsGet;
