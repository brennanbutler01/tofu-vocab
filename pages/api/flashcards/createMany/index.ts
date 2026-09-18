import { createCardsSchema } from 'server/cardInput';
import prisma from 'prisma/db/index';
import createManyFlashcards from 'flashcard/crud/createMany';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';
import { validateSession } from 'utils/validateSession';

async function CreateManyFlashcardsHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const validatedSession = validateSession(
		await getServerSession(req, res, authOptions),
	);
	const validatedHttpMethod = validateHttpMethod(
		req.method as HttpMethods,
		[HttpMethods.POST],
		'/api/flashcards/createMany',
	);

	if (validatedSession?.error) {
		res.status(401).json({
			err: 'You must be authorized to view this api endpoint. Please sign in',
		});
	} else if (validatedHttpMethod.error) {
		res.status(405).json({ err: validatedHttpMethod.message });
	} else {
		const cards = createCardsSchema.safeParse(req.body);
		if (!cards.success)
			return res.status(400).json({ err: 'Invalid flashcards.' });
		const box = await prisma.leitnerBox.findUnique({
			where: {
				userId_boxNumber: {
					userId: validatedSession.userId,
					boxNumber: 0,
				},
			},
		});
		if (!box)
			return res
				.status(409)
				.json({ err: 'Initialize your study boxes first.' });
		res.status(200).json(
			await createManyFlashcards.dbCreateManyFlashcards(
				cards.data.map(card => ({
					...card,
					userId: validatedSession.userId,
					boxId: box.id,
				})),
			),
		);
	}
}

export default CreateManyFlashcardsHandler;
