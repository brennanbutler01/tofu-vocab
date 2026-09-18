import {
	Flashcard,
	FlashcardSources,
	LeitnerBox,
	Prisma,
	StudyAttempt,
	StudySides,
} from '@prisma/client';
import { FlashcardCrud } from '.';
import http from 'utils/http';
import prisma from 'prisma/db/index';
import { FlashcardWithBox } from './getOne';
import { checkAnswer } from 'flashcard/checkAnswer';
import { moveToBox } from 'flashcard/moveToBox';
import { SWRMutationResponse } from 'swr/mutation';

interface IAnswer {
	userId: string;
	flashcard: FlashcardWithBox;
	side: StudySides;
	answer: string[];
	isCorrect: boolean;
}

interface IUpdate {
	flashcardId: string;
	updatedFlashcard: Prisma.FlashcardUpdateInput;
	trigger: SWRMutationResponse<
		FlashcardWithBox[],
		Error,
		string,
		Prisma.FlashcardUpdateInput
	>['trigger'];
}

interface IAnswerFlashcard {
	trigger: SWRMutationResponse<
		FlashcardWithBox[],
		Error,
		string,
		Prisma.FlashcardUpdateInput
	>['trigger'];
	updateFlashcard: ParsedFormAnswer;
	id: string;
	userBoxes: LeitnerBox[];
	source: FlashcardSources;
}

type ParsedFormAnswer = {
	attempts: Prisma.FlashcardUpdateInput['attempts'];
	box: Prisma.FlashcardUpdateInput['box'];
};

class FlashcardUpdateOne extends FlashcardCrud {
	constructor() {
		super();
	}

	//make a PUT fetch request to the api and return the updated flashcard
	apiUpdateFlashcard = async (
		id: string,
		flashcard: Prisma.FlashcardUpdateInput,
	) =>
		await http.put<FlashcardWithBox, Prisma.FlashcardUpdateInput>(
			this.SINGULAR_ENDPOINT + id,
			flashcard,
		);

	//call our api update function and then mutate the flashcard in the cache
	updateFlashcard = async ({
		flashcardId,
		updatedFlashcard,
		trigger,
	}: IUpdate) => {
		return await trigger(updatedFlashcard, {
			optimisticData: current => {
				const currArray = current || [];
				return currArray?.map(card =>
					card.id === flashcardId
						? ({ ...card, ...updatedFlashcard } as FlashcardWithBox)
						: card,
				);
			},
		});
	};

	//make the update call in the prisma db
	dbUpdateFlashcard = async (
		id: string,
		flashcard: Prisma.FlashcardUpdateInput,
	) =>
		await prisma.flashcard.update({
			where: { id },
			data: flashcard,
			include: { box: true, attempts: true },
		});

	//parse form answer from the study form
	parseFormAnswer = ({
		flashcard,
		side,
		userId,
		answer,
		isCorrect,
	}: IAnswer): ParsedFormAnswer => {
		return {
			attempts: {
				create: {
					isCorrect,
					created_at: new Date(),
					updated_at: new Date(),
					user: {
						connect: {
							id: userId,
						},
					},
				},
			},
			box: {
				connect: {
					userId_boxNumber: {
						userId,
						boxNumber: moveToBox(
							isCorrect,
							flashcard.box.boxNumber,
						),
					},
				},
			},
		};
	};

	answerFlashcard = async ({
		trigger,
		updateFlashcard,
		id,
		userBoxes,
		source,
	}: IAnswerFlashcard) => {
		if (
			updateFlashcard?.attempts?.create &&
			updateFlashcard?.box?.connect
		) {
			const newBox = userBoxes.find(
				box =>
					box.boxNumber ===
					updateFlashcard?.box?.connect?.userId_boxNumber?.boxNumber,
			);

			if (newBox) {
				return await trigger(updateFlashcard, {
					optimisticData: curr => {
						const currArray = curr || [];
						return currArray?.map(card =>
							card.id === id
								? {
										...card,
										attempts: [
											...card.attempts,
											updateFlashcard.attempts
												?.create as StudyAttempt,
										],
										box: newBox,
									}
								: card,
						);
					},
				});
			}
		}
	};
}
const flashcardUpdate = new FlashcardUpdateOne();
export default flashcardUpdate;
