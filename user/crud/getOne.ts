import { User } from '@prisma/client';
import http from 'utils/http';
import { UserCrud } from '.';
import prisma from 'prisma/db/index';
class GetUser extends UserCrud {
	constructor() {
		super();
	}

	//get user from api
	apiGetUser = async (userId: string) =>
		await http.get<User>(this.SINGULAR_API_ENDPOINT + userId);

	//get user from db
	dbGetUser = async (userId: string) =>
		await prisma.user.findUnique({ where: { id: userId } });
}

const getUser = new GetUser();
export default getUser;
