import { withVisitorGuard } from 'server/visitor';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import getManyStudyGroupFlashcards from 'studyGroupFlashcards/crud/getMany';
import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';
import { validateSession } from 'utils/validateSession';
import { authOptions } from './auth/[...nextauth]';

async function StudyGroupFlashcardHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const validatedHttpMethod = validateHttpMethod(
		req.method as HttpMethods,
		[HttpMethods.GET],
		'/api/studyGroupFlashcards',
	);
	const validatedSession = validateSession(
		await getServerSession(req, res, authOptions),
	);

	if (validatedHttpMethod?.error) {
		res.status(405).json({ err: validatedHttpMethod?.message });
	} else if (validatedSession?.error) {
		res.status(401).json({
			err: 'You must be authenticated to view this api endpoint',
		});
	} else {
		res.status(200).json(
			await getManyStudyGroupFlashcards.dbGetStudyGroupFlashcards(
				validatedSession?.userId,
			),
		);
	}
}
export default withVisitorGuard(StudyGroupFlashcardHandler);
