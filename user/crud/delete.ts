import http from 'utils/http';
import { UserCrud } from '.';
import prisma from 'prisma/db/index';

class DeleteUser extends UserCrud {
	constructor() {
		super();
	}

	//send the delete request to api
	apiDeleteUser = async (userId: string) =>
		await http.delete(this.SINGULAR_API_ENDPOINT + userId);

	//actually delete the prisma user
	dbDeleteUser = async (userId: string) =>
		await prisma.user.delete({ where: { id: userId } });
}

const deleteUser = new DeleteUser();
export default deleteUser;
