import { Prisma } from '@prisma/client';
import http from 'utils/http';
import { StudyGroupCrud } from '.';
import prisma from 'prisma/db/index';

class StudyGroupUpdate extends StudyGroupCrud {
	constructor() {
		super();
	}

	apiUpdateStudyGroup = async (
		updatedGroup: Prisma.StudyGroupUpdateInput,
		studyGroupId: string,
	) =>
		await http.put(this.SINGULAR_API_ENDPOINT + studyGroupId, updatedGroup);

	dbUpdateStudyGroup = async (
		updatedGroup: Prisma.StudyGroupUpdateInput,
		studyGroupId: string,
	) =>
		await prisma?.studyGroup?.update({
			where: { id: studyGroupId },
			data: updatedGroup,
			include: {
				users: {
					select: { id: true },
				},
				flashcards: true,
			},
		});
}

const studyGroupUpdate = new StudyGroupUpdate();
export default studyGroupUpdate;
