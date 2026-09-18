import http from '../../utils/http';
import prisma from '../../prisma/db';
import { InvitationCrud } from './index';
import { Prisma } from '@prisma/client';

const invitationsWithRecipientEmail =
	Prisma.validator<Prisma.InvitationDefaultArgs>()({
		include: {
			recipient: {
				select: {
					email: true,
				},
			},
			group: {
				select: {
					name: true,
				},
			},
		},
	});

export type InvitationWithRecipientEmail = Prisma.InvitationGetPayload<
	typeof invitationsWithRecipientEmail
>;

class InvitationsGetMany extends InvitationCrud {
	constructor() {
		super();
	}

	//make our fetch GET request to the flashcards api and return them all
	apiGetInvitations = async () =>
		await http.get<InvitationWithRecipientEmail[]>(this.API_ENDPOINT);

	//get the flashcards from prisma
	dbGetInvitations = async (userId: string) =>
		await prisma?.invitation.findMany({
			where: {
				OR: [
					{
						sentById: userId,
					},
					{
						recipientId: userId,
					},
				],
			},
			include: {
				recipient: {
					select: {
						email: true,
					},
				},
				group: {
					select: { name: true },
				},
			},
		});
}

const invitationsGetMany = new InvitationsGetMany();
export default invitationsGetMany;
