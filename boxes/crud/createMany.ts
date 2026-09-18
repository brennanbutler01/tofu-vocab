import { Prisma } from '@prisma/client';
import http from 'utils/http';
import { BoxCrud } from '.';
import prisma from 'prisma/db/index';

class CreateManyBoxes extends BoxCrud {
	INIT_ENDPOINT = '/api/boxes/init';
	constructor() {
		super();
	}

	//send the create many data to the endpoint
	apiCreateManyBoxes = async (
		boxesToCreate: Prisma.LeitnerBoxCreateManyInput[],
	) => await http.post(this.INIT_ENDPOINT, boxesToCreate);

	//make the actual create many request to the db
	dbCreateManyBoxes = async (
		boxesToCreate: Prisma.LeitnerBoxCreateManyInput[],
	) => {
		try {
			return await prisma.leitnerBox.createMany({
				data: boxesToCreate,
			});
		} catch (error) {
			console.log(error);
		}
	};

	//this method will make an array of create box inputs for boxes 0-4
	initBoxes = (userId: string): Prisma.LeitnerBoxCreateManyInput[] => {
		return Array.from(Array(5).keys()).map(boxNumber => ({
			boxNumber,
			userId,
		}));
	};
}

const createManyBoxes = new CreateManyBoxes();
export default createManyBoxes;
