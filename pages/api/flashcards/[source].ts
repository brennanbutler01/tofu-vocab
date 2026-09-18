import { withVisitorGuard } from 'server/visitor';
import { createCardSchema } from 'server/cardInput';
import { z } from 'zod';
import { FlashcardSources } from '@prisma/client';
import flashcardCreate from 'flashcard/crud/create';
import flashcardsGet from 'flashcard/crud/getMany';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';
import { validateSession } from 'utils/validateSession';
import { authOptions } from '../auth/[...nextauth]';

const FlashcardHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req;
	const validateMethod = validateHttpMethod(
		method as HttpMethods,
		[HttpMethods.GET, HttpMethods.POST],
		'/api/flashcards',
	);

	const { error: authError, userId } = validateSession(
		await getServerSession(req, res, authOptions),
	);

	if (authError) {
		res.status(401).json({
			err: 'You must be authorized to view this api endpoint. Please sign-in.',
		});
	} else if (validateMethod.error) {
		res.status(405).json({ err: validateMethod.message });
	} else {
		switch (method) {
			case HttpMethods.GET:
				const source = z
					.nativeEnum(FlashcardSources)
					.safeParse(req.query.source);
				if (!source.success)
					return res
						.status(400)
						.json({ err: 'Invalid study source.' });
				const flashcards = await flashcardsGet.getFlashcardFetcher(
					source.data,
					userId,
				);
				res.status(200).json(flashcards);
				break;
			case HttpMethods.POST:
				const card = createCardSchema.safeParse(req.body);
				if (!card.success)
					return res.status(400).json({ err: 'Invalid flashcard.' });
				const newFlashcard = await flashcardCreate.dbCreateFlashcard(
					{
						...card.data,
						createdBy: { connect: { id: userId } },
						box: {
							connect: {
								userId_boxNumber: { userId, boxNumber: 0 },
							},
						},
					},
					userId,
				);
				res.status(200).json(newFlashcard);
				break;
		}
	}
};

export default withVisitorGuard(FlashcardHandler);
