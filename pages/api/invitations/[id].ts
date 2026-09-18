import prisma from 'prisma/db/index';
import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';
import { validateSession } from 'utils/validateSession';
import { authOptions } from '../auth/[...nextauth]';
import invitationUpdate from '../../../invitations/crud/update';
import { validateIdQuery } from '../../../utils/validateIdQuery';

const InvitationHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req;
	const validateMethod = validateHttpMethod(
		method as HttpMethods,
		[HttpMethods.PUT],
		'/api/invitations',
	);
	const validatedIdQuery = validateIdQuery(req.query.id);

	const { error: authError, userId } = validateSession(
		await getServerSession(req, res, authOptions),
	);

	if (authError) {
		res.status(401).json({
			err: 'You must be authorized to view this api endpoint. Please sign-in.',
		});
	} else if (validateMethod.error) {
		res.status(405).json({ err: validateMethod.message });
	} else if (validatedIdQuery.error) {
		res.status(403).json(validatedIdQuery.message);
	} else {
		switch (method) {
			case HttpMethods.PUT:
				const id = req.query.id;
				if (typeof id !== 'string')
					return res.status(400).json({ err: 'Invalid ID.' });
				const parsed = z
					.object({ status: z.enum(['ACCEPTED', 'DENIED']) })
					.strict()
					.safeParse(req.body);
				if (!parsed.success)
					return res
						.status(400)
						.json({ err: 'Invalid invitation response.' });
				const invitation = await prisma.invitation.findUnique({
					where: { id, recipientId: userId },
				});
				if (!invitation)
					return res
						.status(404)
						.json({ err: 'Invitation not found.' });
				if (invitation.status !== 'PENDING')
					return res
						.status(409)
						.json({ err: 'Invitation already answered.' });
				const updated = await prisma.$transaction(async tx => {
					const result = await tx.invitation.update({
						where: { id, recipientId: userId, status: 'PENDING' },
						data: parsed.data,
						include: {
							recipient: { select: { email: true } },
							group: { select: { name: true } },
						},
					});
					if (parsed.data.status === 'ACCEPTED')
						await tx.studyGroup.update({
							where: { id: invitation.groupId },
							data: { users: { connect: { id: userId } } },
						});
					return result;
				});
				return res.status(200).json(updated);
		}
	}
};

export default InvitationHandler;
