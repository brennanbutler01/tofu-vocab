import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import userStatsCrud from 'user/crud/stats';
import { validateSession } from 'utils/validateSession';
import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';

async function StatsHandler(req: NextApiRequest, res: NextApiResponse) {
	const validatedSession = validateSession(
		await getServerSession(req, res, authOptions),
	);
	const validatedMethod = validateHttpMethod(
		req.method as HttpMethods,
		[HttpMethods.GET],
		'/api/stats/:date',
	);

	if (validatedSession.error) {
		res.status(405).json({
			err: 'You must be authorized to view this api endpoint - Please sign in.',
		});
	} else if (validatedMethod.error) {
		res.status(401).json(validatedMethod.message);
	} else {
		const stats = await userStatsCrud.getStats(validatedSession.userId);

		res.status(200).json(stats);
	}
}

export default StatsHandler;
