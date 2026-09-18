import { z } from 'zod';
import { randomUUID } from 'crypto';
import prisma from 'prisma/db/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';
import { validateSession } from 'utils/validateSession';
import { authOptions } from '../auth/[...nextauth]';
import invitationsGetMany from '../../../invitations/crud/get';
import createInvitation from '../../../invitations/crud/create';

const InvitationsHandler = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	const { method } = req;
	const validateMethod = validateHttpMethod(
		method as HttpMethods,
		[HttpMethods.GET, HttpMethods.POST],
		'/api/invitations',
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
				console.log('getting invitations');
				const invitations = await invitationsGetMany.dbGetInvitations(
					userId,
				);
				res.status(200).json(invitations);
				break;
			case HttpMethods.POST:
				const input = z
					.object({
						recipient: z.object({
							connect: z.object({ email: z.string().email() }),
						}),
						group: z.object({
							connect: z.object({ id: z.string().min(1) }),
						}),
					})
					.safeParse(req.body);
				if (!input.success)
					return res.status(400).json({ err: 'Invalid invitation.' });
				const group = await prisma.studyGroup.findUnique({
					where: {
						id: input.data.group.connect.id,
						OR: [
							{ ownerId: userId },
							{ users: { some: { id: userId } } },
						],
					},
				});
				if (!group)
					return res.status(404).json({ err: 'Group not found.' });
				const recipient = await prisma.user.findUnique({
					where: { email: input.data.recipient.connect.email },
				});
				if (!recipient)
					return res
						.status(400)
						.json({ err: 'Unable to invite that account.' });
				const newInvitation = await createInvitation.dbCreateInvitation(
					{
						id: randomUUID(),
						status: 'PENDING',
						recipient: { connect: { id: recipient.id } },
						group: { connect: { id: group.id } },
						sentBy: { connect: { id: userId } },
					},
				);
				return res.status(200).json(newInvitation);
		}
	}
};

export default InvitationsHandler;
