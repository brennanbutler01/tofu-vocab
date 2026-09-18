import { withVisitorGuard } from 'server/visitor';
import createBox from 'boxes/crud/create';
import getManyBoxes from 'boxes/crud/getMany';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';
import { validateSession } from 'utils/validateSession';
import { authOptions } from '../auth/[...nextauth]';

const BoxesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req;
	const validateMethod = validateHttpMethod(
		method as HttpMethods,
		[HttpMethods.GET, HttpMethods.POST],
		'/api/boxes',
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
				console.log('getting boxes');
				const boxes = await getManyBoxes.dbGetManyBoxes(userId);
				res.status(200).json(boxes);
				break;
			case HttpMethods.POST:
				const newBox = await createBox.dbCreateBox(req.body);
				res.status(200).json(newBox);
				break;
		}
	}
};

export default withVisitorGuard(BoxesHandler);
