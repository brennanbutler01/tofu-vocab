import {
	Button,
	Group,
	ScrollArea,
	Stack,
	Text,
	TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Invitation, InvitationStatus, Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { useSession } from 'next-auth/react';
import createInvitation from '../../invitations/crud/create';
import { showNotification } from '@mantine/notifications';
import { BiCheck, BiX } from 'react-icons/bi';
import { useInvitationSWR } from '../../invitations/swr';
import useSWRMutation from 'swr/mutation';
import React from 'react';
import InvitationCard from '@/components/invitation/invitationCard';
import { StudyGroupWithFlashcards } from '../../studyGroups/crud/getMany';
import { closeAllModals } from '@mantine/modals';

interface Props {
	group: StudyGroupWithFlashcards;
}

const InvitationForm = ({ group }: Props) => {
	const { data } = useSession();
	const { data: invitations } = useInvitationSWR();

	const { trigger, isMutating } = useSWRMutation<
		Invitation[],
		Error,
		string,
		Prisma.InvitationCreateInput
	>(
		'/api/invitations',
		async (url: string, { arg }: { arg: Prisma.InvitationCreateInput }) =>
			await createInvitation
				.apiCreateInvitation(arg)
				.then(res => [...invitations, res]),
	);

	console.log(group.users);

	const form = useForm<Prisma.InvitationCreateInput>({
		initialValues: {
			id: uuid(),
			status: InvitationStatus.PENDING,
			dateSent: new Date(),
			recipient: {
				connect: {
					email: '',
				},
			},
			sentBy: {
				connect: {
					email: data?.user?.email || '',
				},
			},
			group: {
				connect: {
					id: group.id,
				},
			},
		},
		validate: {
			recipient: {
				connect: {
					email: (value: string) =>
						group.users.some(user => user.email === value)
							? 'User already in group'
							: invitations.some(
										invitation =>
											invitation.recipient.email ===
												value &&
											invitation.status ===
												InvitationStatus.PENDING &&
											invitation.groupId === group.id,
								  )
								? 'There is already an invite for this user'
								: null,
				},
			},
		},
	});

	const onSubmit = async (values: Prisma.InvitationCreateInput) => {
		try {
			await trigger(values, {
				optimisticData: currentData =>
					Array.isArray(currentData)
						? [
								...currentData,
								{
									...values,
									sentById: data?.user?.id as string,
									recipientId: '',
									recipient: {
										email: values.recipient.connect?.email,
									},
									groupId: group.id,
								} as Invitation,
							]
						: [
								{
									...values,
									sentById: data?.user?.id as string,
									recipientId: '',
									recipient: {
										email: values.recipient.connect?.email,
									},
									groupId: group.id,
								} as Invitation,
							],
			});
			closeAllModals();
			showNotification({
				color: 'green',
				icon: <BiCheck />,
				title: 'Invitation Sent',
				message: 'Invitation sent!',
			});
		} catch (e) {
			showNotification({
				color: 'red',
				icon: <BiX />,
				title: 'Invitation Error',
				message:
					'There was an error trying to send your invitation. Please check again',
			});
		}
	};
	return (
		<form onSubmit={form.onSubmit(onSubmit)}>
			<Stack>
				<TextInput
					placeholder={'bb@bb.com'}
					label={'Email'}
					inputWrapperOrder={[
						'label',
						'input',
						'error',
						'description',
					]}
					required
					description={
						'Enter an email here and if they are registered, they will have an invite for the group!'
					}
					type={'email'}
					{...form.getInputProps('recipient.connect.email')}
				/>
				<Group position={'right'}>
					<Button type={'submit'}>Send invitation</Button>
				</Group>
			</Stack>
			<Text size={'xl'}>Sent Invites</Text>
			<ScrollArea h={380}>
				<Stack>
					{(invitations || []).reduce<React.ReactNode[]>(
						(acc, curr) => {
							if (curr.sentById === data?.user?.id) {
								return [
									...acc,
									<InvitationCard invitation={curr} />,
								];
							}
							return acc;
						},
						[],
					)}
				</Stack>
			</ScrollArea>
		</form>
	);
};
export default InvitationForm;
