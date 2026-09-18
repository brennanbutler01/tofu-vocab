import {
	Prisma,
	User,
	LeitnerBox,
	FlashcardSources,
	FlashcardOrigins,
} from '@prisma/client';
import { FlashcardCrud } from '.';
import http from 'utils/http';
import prisma from 'prisma/db/index';
import { FormValues } from '@/components/flashcard/FlashcardForm';
import { v4 } from 'uuid';
import { SWRMutationResponse } from 'swr/mutation';
import { FlashcardWithBox } from './getOne';

interface ICreate {
	formVals: FormValues['card'];
	user: User;
	userBoxes: LeitnerBox[];
	origin: FlashcardOrigins;
	trigger: SWRMutationResponse<
		FlashcardWithBox[],
		Error,
		string,
		Prisma.FlashcardCreateInput
	>['trigger'];
}

class FlashcardCreate extends FlashcardCrud {
	constructor() {
		super();
	}

	//send our fetch POST request to the api
	apiCreateFlashcard = async (
		flashcard: Prisma.FlashcardCreateInput,
		source: FlashcardSources,
	) =>
		await http.post<FlashcardWithBox, Prisma.FlashcardCreateInput>(
			this.API_ENDPOINT + `/${source}`,
			flashcard,
		);

	//create the flashcard in prisma
	dbCreateFlashcard = async (
		flashcard: Prisma.FlashcardCreateInput,
		userId: string,
	) =>
		await prisma.flashcard.create({
			data: {
				...flashcard,
				box: {
					connect: {
						userId_boxNumber: {
							boxNumber: 0,
							userId,
						},
					},
				},
			},
			include: {
				attempts: true,
				box: true,
			},
		});

	//parse form values and create a new card
	parseCreate = async ({
		formVals: { front, back },
		origin,
		user,
		userBoxes,
		trigger,
	}: ICreate) => {
		//these are the vals to create the new card with
		const newCard = {
			id: v4(),
			front: front.split(','),
			back: back.split(','),
			created_at: new Date(),
			updated_at: new Date(),
			origin,
			createdBy: {
				connect: {
					id: user?.id,
				},
			},
			box: {
				connect: {
					userId_boxNumber: {
						userId: user?.id,
						boxNumber: 0,
					},
				},
			},
		};

		//get users first box
		const box0 = userBoxes?.find(({ boxNumber }) => boxNumber === 0);
		if (box0) {
			//make our create request
			const result = await trigger(newCard, {
				//update our data
				optimisticData: current => {
					const currentArray = current || [];
					return [
						...currentArray,
						{
							...newCard,
							front: front.split(','),
							back: back.split(','),
							createdBy: user,
							userId: user?.id,
							box: box0,
							boxId: box0?.id,
							attempts: [],
							origin,
						},
					];
				},
			});
			return result;
		}
		throw new Error(
			'Study boxes are not ready. Please reload and try again.',
		);
	};
}

const flashcardCreate = new FlashcardCreate();
export default flashcardCreate;
