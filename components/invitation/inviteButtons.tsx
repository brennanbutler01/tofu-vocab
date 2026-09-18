import { ActionIcon, Button } from '@mantine/core';
import { InvitationStatus, Prisma } from '@prisma/client';
import { BiCheck, BiX } from 'react-icons/bi';
import React from 'react';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import studyGroupUpdate from '../../studyGroups/crud/update';
import { InvitationWithRecipientEmail } from '../../invitations/crud/get';
import invitationUpdate from '../../invitations/crud/update';
import { useSession } from 'next-auth/react';
import { useInvitationSWR } from '../../invitations/swr';

interface Props {
	invitation: InvitationWithRecipientEmail;
}
const InviteButtons = ({ invitation }: Props) => {
	const session = useSession();
	const { mutate } = useSWRConfig();
	const { data: invitations } = useInvitationSWR();
	const { trigger } = useSWRMutation<
		InvitationWithRecipientEmail[],
		Error,
		string,
		Prisma.InvitationUpdateInput
	>(
		'/api/invitations',
		async (
			_url: string,
			{
				arg,
			}: {
				arg: Prisma.InvitationUpdateInput;
			},
		) => {
			return (await invitationUpdate
				.apiUpdateInvitation(invitation.id, arg)
				.then(res =>
					invitations.map(invite =>
						invite.id === invitation.id
							? {
									...invite,
									status: arg.status,
								}
							: invite,
					),
				)) as InvitationWithRecipientEmail[];
		},
	);

	return (
		<Button.Group>
			<ActionIcon
				title={'Accept Invite'}
				color={'green'}
				onClick={async () => {
					await trigger(
						{
							status: InvitationStatus.ACCEPTED,
						} as Prisma.InvitationUpdateInput,
						{
							optimisticData: currentData =>
								Array.isArray(currentData)
									? currentData.map(invite =>
											invite.id === invitation.id
												? {
														...invite,
														status: InvitationStatus.ACCEPTED,
													}
												: invite,
										)
									: [],
						},
					);

					await mutate('/api/studyGroups');
				}}
			>
				<BiCheck />
			</ActionIcon>
			<ActionIcon
				title={'Decline Invite'}
				color={'red'}
				onClick={async () => {
					await trigger(
						{
							status: InvitationStatus.DENIED,
						} as Prisma.InvitationUpdateInput,
						{
							optimisticData: currentData =>
								Array.isArray(currentData)
									? currentData.map(invite =>
											invite.id === invitation.id
												? {
														...invite,
														status: InvitationStatus.DENIED,
													}
												: invite,
										)
									: [],
						},
					);
				}}
			>
				<BiX />
			</ActionIcon>
		</Button.Group>
	);
};

export default InviteButtons;
