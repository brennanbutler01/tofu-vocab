import http from 'utils/http';
import prisma from 'prisma/db/index';
import { GroupFlashcard } from '@prisma/client';

class GetManyStudyGroupFlashcards {
	API_ENDPOINT = '/api/studyGroupFlashcards';

	apiGetStudyGroupFlashcards = async () =>
		await http.get<GroupFlashcard[]>(this.API_ENDPOINT);

	dbGetStudyGroupFlashcards = async (userId: string) =>
		await prisma?.groupFlashcard?.findMany({
			where: {
				studyGroup: {
					is: {
						OR: [
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
				},
			},
		});
}

const getManyStudyGroupFlashcards = new GetManyStudyGroupFlashcards();
export default getManyStudyGroupFlashcards;
