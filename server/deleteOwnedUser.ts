import type { Prisma } from '@prisma/client';

export async function deleteOwnedUser(
	tx: Prisma.TransactionClient,
	userId: string,
) {
	await tx.invitation.deleteMany({
		where: {
			OR: [
				{ recipientId: userId },
				{ sentById: userId },
				{ group: { ownerId: userId } },
			],
		},
	});
	await tx.studyGroup.deleteMany({ where: { ownerId: userId } });
	await tx.user.deleteMany({ where: { id: userId } });
}
