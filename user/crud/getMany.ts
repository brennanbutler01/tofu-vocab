import { User } from '@prisma/client';
import http from 'utils/http';
import { UserCrud } from '.';

//TODO - write test for this someday - not using right now
class GetManyUsers extends UserCrud {
	constructor() {
		super();
	}

	//make a get request for all of the users
	apiGetUsers = async () => await http.get<User[]>(this.API_ENDPOINT);

	//get all users from db
	dbGetUsers = async () => await prisma.user.findMany({});
}

const getManyUsers = new GetManyUsers();
export default getManyUsers;
