import http from 'utils/http';
import { StudyGroupCrud } from '.';
import prisma from 'prisma/db/index';
import { Prisma } from '@prisma/client';

const studyGroupWithFlashcards =
	Prisma.validator<Prisma.StudyGroupDefaultArgs>()({
		include: {
			flashcards: true,
			users: { select: { id: true, email: true } },
		},
	});

export type StudyGroupWithFlashcards = Prisma.StudyGroupGetPayload<
	typeof studyGroupWithFlashcards
>;

class GetManyStudyGroups extends StudyGroupCrud {
	constructor() {
		super();
	}

	apiGetStudyGroups = async () =>
		await http.get<StudyGroupWithFlashcards[]>(this.API_ENDPOINT);

	dbGetStudyGroups = async (userId: string) =>
		await prisma.studyGroup.findMany({
			where: {
				...(process.env.VISITOR_DEMO === 'true'
					? { ownerId: userId }
					: {}),
				OR: [
					{ ownerId: userId },
					{ allowJoin: true },
					{
						users: {
							some: {
								id: userId,
							},
						},
					},
				],
			},
			include: {
				flashcards: true,
				users: { select: { id: true, email: true } },
			},
		});

	filterStudyGroups = (
		filter: 'all' | 'yours' | 'public',
		groups: StudyGroupWithFlashcards[],
		userId: string,
	) => {
		switch (filter) {
			case 'all':
				return groups;
			case 'public':
				return groups.filter(g => g.allowJoin);
			case 'yours':
				return groups.filter(
					g =>
						g.ownerId === userId ||
						g.users.some(u => u.id === userId),
				);
		}
	};
}

const getManyStudyGroups = new GetManyStudyGroups();
export default getManyStudyGroups;
