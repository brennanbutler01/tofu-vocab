import { Prisma } from '@prisma/client';
import http from 'utils/http';
import { StudyGroupCrud } from '.';
import prisma from 'prisma/db/index';
import { GroupForm } from '@/components/groups/GroupForm';
import { FlashcardWithBox } from 'flashcard/crud/getOne';

interface IParseForm extends GroupForm {
	userId: string;
	userFlashcards: FlashcardWithBox[];
}

class CreateStudyGroup extends StudyGroupCrud {
	constructor() {
		super();
	}

	apiCreateStudyGroup = async (data: Prisma.StudyGroupCreateInput) =>
		await http.post(this.API_ENDPOINT, data);

	dbCreateStudyGroup = async (data: Prisma.StudyGroupCreateInput) =>
		await prisma.studyGroup.create({
			data,
			include: { flashcards: true, users: { select: { id: true } } },
		});

	parseForm = ({
		userId,
		description,
		isPublic,
		name,
		flashcards,
		userFlashcards,
	}: IParseForm): Prisma.StudyGroupCreateInput => {
		console.log('form fc', flashcards);
		return {
			owner: {
				connect: {
					id: userId,
				},
			},
			allowJoin: isPublic,
			description,
			name,
			createdAt: new Date(),
			image: null,
			updatedAt: new Date(),
			users: {
				connect: { id: userId },
			},
			flashcards: {
				createMany: {
					data: flashcards[1].map(fc => {
						console.log('fc', fc);
						const fullCard = userFlashcards.find(
							card => card.id === fc.value,
						) as FlashcardWithBox;

						return {
							back: fullCard.back,
							front: fullCard.front,
						};
					}),
				},
			},
		};
	};
}

const createStudyGroup = new CreateStudyGroup();
export default createStudyGroup;
