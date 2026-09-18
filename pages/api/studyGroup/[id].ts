import { withVisitorGuard } from 'server/visitor';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from 'prisma/db/index';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { validateSession } from 'utils/validateSession';
import { groupEditSchema, groupMembershipSchema } from 'server/groupInput';

async function studyGroupHandler(req: NextApiRequest, res: NextApiResponse) {
	const { userId } = validateSession(
		await getServerSession(req, res, authOptions),
	);
	if (!userId) return res.status(401).json({ err: 'Please sign in.' });
	if (!['GET', 'PUT', 'DELETE'].includes(req.method || ''))
		return res.status(405).json({ err: 'Method not allowed.' });
	const id = req.query.id;
	if (typeof id !== 'string' || !id)
		return res.status(400).json({ err: 'Group ID required.' });
	const group = await prisma.studyGroup.findUnique({
		where: {
			id,
			...(process.env.VISITOR_DEMO === 'true' ? { ownerId: userId } : {}),
		},
		include: {
			users: { select: { id: true } },
			flashcards: true,
		},
	});
	const isMember = group?.users.some(user => user.id === userId);
	const isOwner = group?.ownerId === userId;
	if (!group || (!isOwner && !isMember && !group.allowJoin))
		return res.status(404).json({ err: 'Group not found.' });
	if (req.method === 'GET') return res.status(200).json(group);
	if (req.method === 'DELETE') {
		if (!isOwner)
			return res
				.status(403)
				.json({ err: 'Only the owner can delete a group.' });
		return res.status(200).json(
			await prisma.studyGroup.delete({
				where: { id, ownerId: userId },
			}),
		);
	}
	const membership = groupMembershipSchema.safeParse(req.body);
	if (membership.success) {
		const users = membership.data.users;
		const isJoining = 'connect' in users;
		const requestedId = isJoining ? users.connect.id : users.disconnect.id;
		if (
			requestedId !== userId ||
			(isJoining && !group.allowJoin && !isOwner) ||
			(!isJoining && isOwner)
		)
			return res
				.status(403)
				.json({ err: 'This membership change is not allowed.' });
		return res.status(200).json(
			await prisma.studyGroup.update({
				where: {
					id,
					...(isJoining && !isOwner ? { allowJoin: true } : {}),
				},
				data: { users },
				include: { users: { select: { id: true } }, flashcards: true },
			}),
		);
	}
	if (!isOwner)
		return res
			.status(403)
			.json({ err: 'Only the owner can edit a group.' });
	const edit = groupEditSchema.safeParse(req.body);
	if (!edit.success)
		return res.status(400).json({ err: 'Invalid group update.' });
	return res.status(200).json(
		await prisma.studyGroup.update({
			where: { id, ownerId: userId },
			data: edit.data,
			include: { users: { select: { id: true } }, flashcards: true },
		}),
	);
}

export default withVisitorGuard(studyGroupHandler);
