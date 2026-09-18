import { withVisitorGuard } from 'server/visitor';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import userStatsCrud from 'user/crud/stats';
import { validateSession } from 'utils/validateSession';

async function attemptsPerDayHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const validatedSession = validateSession(
		await getServerSession(req, res, authOptions),
	);

	if (validatedSession.error) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	} else {
		res.status(200).json(
			await userStatsCrud.getAttemptsPerDay(validatedSession?.userId),
		);
	}
}
export default withVisitorGuard(attemptsPerDayHandler);
