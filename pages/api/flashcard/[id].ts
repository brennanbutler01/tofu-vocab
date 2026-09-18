import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from 'prisma/db/index';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { validateSession } from 'utils/validateSession';
import { createFlashcardRequest } from 'server/flashcardRequest';

const handleFlashcard = createFlashcardRequest({
	find: scope =>
		prisma.flashcard.findUnique({
			where: scope,
			include: { box: true, attempts: true },
		}),
	update: ({ id, userId, data }) =>
		prisma.flashcard.update({
			where: { id, userId },
			data,
			include: { box: true, attempts: true },
		}),
	remove: scope => prisma.flashcard.delete({ where: scope }),
});

export default async function FlashcardHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { userId } = validateSession(
		await getServerSession(req, res, authOptions),
	);
	const result = await handleFlashcard({
		userId,
		method: req.method,
		id: req.query.id,
		body: req.body,
	});
	return res.status(result.status).json(result.body);
}
