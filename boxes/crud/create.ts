import { LeitnerBox, Prisma } from '@prisma/client';
import http from 'utils/http';
import { BoxCrud } from '.';
import prisma from 'prisma/db/index';

class CreateBox extends BoxCrud {
	constructor() {
		super();
	}

	//make a post request to the api to create the box
	apiCreateBox = async (boxToCreate: Prisma.LeitnerBoxCreateInput) =>
		await http.post<LeitnerBox, Prisma.LeitnerBoxCreateInput>(
			this.API_ENDPOINT,
			boxToCreate,
		);

	//create the box in the db
	dbCreateBox = async (boxToCreate: Prisma.LeitnerBoxCreateInput) =>
		await prisma.leitnerBox.create({ data: boxToCreate });
}

const createBox = new CreateBox();
export default createBox;
