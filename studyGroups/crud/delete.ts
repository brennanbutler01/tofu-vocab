import { StudyGroupCrud } from '.';
import prisma from 'prisma/db/index';
import http from 'utils/http';

class DeleteStudyGroup extends StudyGroupCrud {
	constructor() {
		super();
	}

	apiDeleteStudyGroup = async (groupId: string) =>
		await http.delete(this.SINGULAR_API_ENDPOINT + groupId);

	dbDeleteStudyGroup = async (groupId: string) =>
		await prisma?.studyGroup?.delete({ where: { id: groupId } });
}

const deleteStudyGroup = new DeleteStudyGroup();
export default deleteStudyGroup;
