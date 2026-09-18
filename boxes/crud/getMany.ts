import { LeitnerBox } from '@prisma/client';
import http from 'utils/http';
import { BoxCrud } from './index';
import prisma from 'prisma/db/index';

class GetManyBoxes extends BoxCrud {
	constructor() {
		super();
	}

	apiGetManyBoxes = async () =>
		await http.get<LeitnerBox[]>(this.API_ENDPOINT);

	dbGetManyBoxes = async (userId: string) =>
		await prisma.leitnerBox.findMany({
			where: {
				userId,
			},
			orderBy: {
				boxNumber: 'asc',
			},
		});
}

const getManyBoxes = new GetManyBoxes();
export default getManyBoxes;
