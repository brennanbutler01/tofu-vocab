import { groupCreateSchema } from 'server/groupInput';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import createStudyGroup from 'studyGroups/crud/create';
import getManyStudyGroups from 'studyGroups/crud/getMany';
import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';
import { validateSession } from 'utils/validateSession';
import { authOptions } from './auth/[...nextauth]';

async function studyGroupsHandler(req: NextApiRequest, res: NextApiResponse) {
	const { method } = req;
	const validatedHttpMethod = validateHttpMethod(
		method as HttpMethods,
		[HttpMethods.GET, HttpMethods.POST],
		'/api/studyGroups',
	);
	const validatedSession = validateSession(
		await getServerSession(req, res, authOptions),
	);

	if (validatedSession.error) {
		return res.status(401).json({ error: validatedSession.error });
	} else if (validatedHttpMethod.error) {
		return res.status(405).json({ error: validatedHttpMethod.error });
	} else {
		switch (method) {
			case HttpMethods.GET:
				const studyGroups = await getManyStudyGroups.dbGetStudyGroups(
					validatedSession.userId,
				);
				return res.status(200).json(studyGroups);
			case HttpMethods.POST:
				const parsed = groupCreateSchema.safeParse(req.body);
				if (
					!parsed.success ||
					parsed.data.owner.connect.id !== validatedSession.userId ||
					parsed.data.users.connect.id !== validatedSession.userId
				)
					return res
						.status(400)
						.json({ err: 'Invalid group creation.' });
				const { createdAt, updatedAt, ...data } = parsed.data;
				return res
					.status(200)
					.json(await createStudyGroup.dbCreateStudyGroup(data));
			default:
				return res.status(405).json({ error: 'Invalid HTTP method' });
		}
	}
}
export default studyGroupsHandler;
