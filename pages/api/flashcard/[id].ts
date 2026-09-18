import { withVisitorGuard } from 'server/visitor';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from 'prisma/db/index';
import type { Prisma } from '@prisma/client';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { validateSession } from 'utils/validateSession';
import { createFlashcardRequest } from 'server/flashcardRequest';

const createHandler = (database: Prisma.TransactionClient) =>
	createFlashcardRequest({
		find: scope =>
			database.flashcard.findUnique({
				where: scope,
				include: { box: true, attempts: true },
			}),
		update: ({ id, userId, data }) =>
			database.flashcard.update({
				where: { id, userId },
				data,
				include: { box: true, attempts: true },
			}),
		remove: scope => database.flashcard.delete({ where: scope }),
	});

async function FlashcardHandler(req: NextApiRequest, res: NextApiResponse) {
	const { userId } = validateSession(
		await getServerSession(req, res, authOptions),
	);
	const result = await prisma.$transaction(async tx => {
		if (
			req.method === 'PUT' &&
			userId &&
			typeof req.query.id === 'string'
		) {
			// Serialize answers so each attempt advances from the latest box.
			await tx.$queryRaw`SELECT "id" FROM "Flashcard" WHERE "id" = ${req.query.id} AND "userId" = ${userId} FOR UPDATE`;
		}
		return createHandler(tx)({
			userId,
			method: req.method,
			id: req.query.id,
			body: req.body,
		});
	});
	return res.status(result.status).json(result.body);
}

export default withVisitorGuard(FlashcardHandler);
