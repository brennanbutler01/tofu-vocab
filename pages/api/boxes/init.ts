import { withVisitorGuard } from 'server/visitor';
import prisma from 'prisma/db/index';
import createManyBoxes from 'boxes/crud/createMany';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';
import { validateSession } from 'utils/validateSession';
import { authOptions } from '../auth/[...nextauth]';

async function BoxesInitHandler(req: NextApiRequest, res: NextApiResponse) {
	const vadliatedSession = validateSession(
		await getServerSession(req, res, authOptions),
	);
	const validatedMethod = validateHttpMethod(
		req.method as HttpMethods,
		[HttpMethods.POST],
		'/api/boxes/init',
	);

	if (vadliatedSession.error) {
		res.status(401).json({
			err: 'You must be authorized to view this api endpoint. Please sign-in.',
		});
	} else if (validatedMethod.error) {
		res.status(405).json({ err: validatedMethod.message });
	} else {
		res.status(200).json(
			await prisma.leitnerBox.createMany({
				data: createManyBoxes.initBoxes(vadliatedSession.userId),
				skipDuplicates: true,
			}),
		);
	}
}

export default withVisitorGuard(BoxesInitHandler);
