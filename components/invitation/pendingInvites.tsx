import { Accordion } from '@mantine/core';
import React, { useMemo } from 'react';
import { InvitationStatus } from '@prisma/client';
import InvitationCard from '@/components/invitation/invitationCard';
import { useInvitationSWR } from '../../invitations/swr';
import { useSession } from 'next-auth/react';

const PendingInvites = () => {
	const { data: invitations } = useInvitationSWR();
	const session = useSession();
	const pendingInvites = useMemo(
		() =>
			invitations.filter(
				invite =>
					invite.recipientId === session?.data?.user?.id &&
					invite.status === InvitationStatus.PENDING,
			),
		[invitations, session],
	);
	return pendingInvites?.length > 0 ? (
		<Accordion defaultValue={'pending'}>
			<Accordion.Item value={'pending'}>
				<Accordion.Control>Pending Invites</Accordion.Control>
				<Accordion.Panel>
					{pendingInvites.map(invite => (
						<InvitationCard
							key={invite.id}
							invitation={invite}
						/>
					))}
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion>
	) : null;
};
export default PendingInvites;
