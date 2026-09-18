import { ActionIcon } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { SessionProvider, useSession } from 'next-auth/react';
import { ModalTitle } from '../ModalTitle';
import { StudyGroupWithFlashcards } from 'studyGroups/crud/getMany';
import { FcInvite } from 'react-icons/fc';
import InvitationForm from '@/components/invitation';

type Props = { group: StudyGroupWithFlashcards };

export default function InviteButton({ group }: Props) {
	const session = useSession();

	return (
		<ActionIcon
			variant="light"
			color="pink"
			title="Invite to group"
			aria-label="Invite to group"
			radius="md"
			onClick={() =>
				openModal({
					withCloseButton: false,
					centered: true,
					title: <ModalTitle text="Invitations" />,
					children: (
						<SessionProvider session={session?.data}>
							<InvitationForm group={group} />
						</SessionProvider>
					),
					shadow: 'md',
					radius: 'md',
				})
			}
		>
			<FcInvite />
		</ActionIcon>
	);
}
