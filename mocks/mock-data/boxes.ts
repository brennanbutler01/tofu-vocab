import { LeitnerBox } from '@prisma/client';

//mock data boxes 0-4
export const boxes: LeitnerBox[] = [
	{
		boxNumber: 0,
		created_at: new Date(),
		id: '1',
		updated_at: new Date(),
		userId: '1',
	},
	{
		boxNumber: 1,
		created_at: new Date(),
		id: '2',
		updated_at: new Date(),
		userId: '1',
	},
	{
		boxNumber: 2,
		created_at: new Date(),
		id: '3',
		updated_at: new Date(),
		userId: '1',
	},
	{
		boxNumber: 3,
		created_at: new Date(),
		id: '4',
		updated_at: new Date(),
		userId: '1',
	},
	{
		boxNumber: 4,
		created_at: new Date(),
		id: '5',
		updated_at: new Date(),
		userId: '1',
	},
];
