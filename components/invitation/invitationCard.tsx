import { Badge, Card, Group, Text } from '@mantine/core';
import dayjs from 'dayjs';
import React from 'react';
import { InvitationWithRecipientEmail } from '../../invitations/crud/get';
import { useSession } from 'next-auth/react';
import { useInvitationSWR } from '../../invitations/swr';
import InviteButtons from '@/components/invitation/inviteButtons';

interface Props {
	invitation: InvitationWithRecipientEmail;
}

const InvitationCard = ({ invitation }: Props) => {
	const session = useSession();
	const { data: invitations } = useInvitationSWR();

	return (
		<Card
			withBorder
			key={invitation.id}
			p={'sm'}
		>
			<Group
				w={'100%'}
				noWrap
			>
				<Badge
					color={
						invitation.status === 'ACCEPTED'
							? 'green'
							: invitation.status === 'DENIED'
							? 'red'
							: 'orange'
					}
				>
					{invitation.status}
				</Badge>
				<Text truncate>{invitation.recipient.email}</Text>
				<Badge>{dayjs(invitation?.dateSent).format('MM/DD/YY')}</Badge>
				{invitation.recipientId === session.data?.user.id ? (
					<InviteButtons invitation={invitation} />
				) : null}
			</Group>
		</Card>
	);
};

export default InvitationCard;
