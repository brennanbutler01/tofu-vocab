import { canAccessUser, userUpdateSchema } from 'server/userUpdate';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import deleteUser from 'user/crud/delete';
import getUser from 'user/crud/getOne';
import updateUser from 'user/crud/update';
import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';
import { validateIdQuery } from 'utils/validateIdQuery';
import { validateSession } from 'utils/validateSession';
import { authOptions } from '../auth/[...nextauth]';

async function UserHandler(req: NextApiRequest, res: NextApiResponse) {
	const { query, method } = req;
	const validateMethod = validateHttpMethod(
		method as HttpMethods,
		[HttpMethods.GET, HttpMethods.PUT, HttpMethods.DELETE],
		'api/user/:id',
	);
	const validatedSession = validateSession(
		await getServerSession(req, res, authOptions),
	);
	const validatedIdQuery = validateIdQuery(query.id);

	if (validatedSession.error) {
		res.status(401).json({
			err: 'You must be authorized to view this api endpoint. Please sign-in.',
		});
	} else if (validatedIdQuery.error) {
		res.status(403).json({ err: validatedIdQuery.message });
	} else if (!canAccessUser(validatedSession.userId, query.id)) {
		return res.status(404).json({ err: 'User not found.' });
	} else if (validateMethod.error) {
		res.status(405).json({ err: validateMethod.message });
	} else {
		switch (method) {
			case HttpMethods.PUT:
				const parsed = userUpdateSchema.safeParse(req.body);
				if (!parsed.success)
					return res
						.status(400)
						.json({ err: 'Invalid profile update.' });
				res.status(200).json(
					await updateUser.dbUpdateUser(
						validatedSession.userId,
						parsed.data,
					),
				);
				break;
			case HttpMethods.DELETE:
				res.status(200).json(
					await deleteUser.dbDeleteUser(validatedSession.userId),
				);
				break;
			default:
				res.status(200).json(
					await getUser.dbGetUser(validatedSession.userId),
				);
				break;
		}
	}
}
export default UserHandler;
