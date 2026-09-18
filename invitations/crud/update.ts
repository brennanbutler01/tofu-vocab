import { Prisma } from '@prisma/client';
import { InvitationCrud } from '.';
import http from 'utils/http';
import prisma from 'prisma/db/index';
import { InvitationWithRecipientEmail } from './get';

class InvitationUpdateOne extends InvitationCrud {
	constructor() {
		super();
	}

	//make a PUT fetch request to the api and return the updated invitation
	apiUpdateInvitation = async (
		id: string,
		invitation: Prisma.InvitationUpdateInput,
	) =>
		await http.put<
			InvitationWithRecipientEmail,
			Prisma.InvitationUpdateInput
		>(this.SINGULAR_API_ENDPOINT + id, invitation);

	//make the update call in the prisma db
	dbUpdateInvitation = async (
		id: string,
		invitation: Prisma.InvitationUpdateInput,
	) =>
		await prisma.invitation.update({
			where: { id },
			data: invitation,
			include: {
				recipient: { select: { email: true } },
				group: { select: { name: true } },
			},
		});
}
const invitationUpdate = new InvitationUpdateOne();
export default invitationUpdate;
