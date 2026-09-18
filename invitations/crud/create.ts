import { Prisma } from '@prisma/client';
import http from 'utils/http';
import { InvitationCrud } from '.';
import prisma from 'prisma/db/index';
import { InvitationWithRecipientEmail } from './get';

class CreateInvitation extends InvitationCrud {
	constructor() {
		super();
	}

	apiCreateInvitation = async (
		data: Prisma.InvitationCreateInput,
	): Promise<InvitationWithRecipientEmail> =>
		await http.post(this.API_ENDPOINT, data);

	dbCreateInvitation = async (data: Prisma.InvitationCreateInput) =>
		await prisma.invitation.create({
			data,
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

const createInvitation = new CreateInvitation();
export default createInvitation;
