import { withVisitorGuard } from 'server/visitor';
import prisma from 'prisma/db/index';
import flashcardsGet from 'flashcard/crud/getMany';
import flashcardGet from 'flashcard/crud/getOne';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';
import { validateSession } from 'utils/validateSession';

async function FindDuplicateFlashcardsHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const validatedSession = validateSession(
		await getServerSession(req, res, authOptions),
	);
	const validatedHttpMethod = validateHttpMethod(
		req.method as HttpMethods,
		[HttpMethods.GET],
		'/api/flashcard/findDuplicates/:id',
	);

	if (validatedSession.error) {
		res.status(401).json({
			err: 'You must be authorized to view this api endpoint',
		});
	} else if (validatedHttpMethod.error) {
		res.status(405).json({ err: validatedHttpMethod.error });
	} else {
		const id = req.query.id;
		if (typeof id !== 'string')
			return res.status(400).json({ err: 'Invalid ID.' });
		const thisFlashcard = await prisma.flashcard.findUnique({
			where: { id, userId: validatedSession.userId },
		});

		if (thisFlashcard) {
			res.status(200).json(
				await flashcardsGet.dbGetDuplicateCards(
					thisFlashcard,
					validatedSession.userId,
				),
			);
		} else {
			res.status(404).json({ err: 'Flashcard not found.' });
		}
	}
}

export default withVisitorGuard(FindDuplicateFlashcardsHandler);
