import { ActionIcon, Stack, Text } from '@mantine/core';
import { closeAllModals, openConfirmModal } from '@mantine/modals';
import { StudyGroup } from '@prisma/client';
import { BiTrash } from 'react-icons/bi';
import { ModalTitle } from '../ModalTitle';
import useSWRMutation from 'swr/mutation';
import deleteStudyGroup from 'studyGroups/crud/delete';
import React from 'react';
import { useSession } from 'next-auth/react';

type Props = {
	group: StudyGroup;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteGroup({ group, setLoading }: Props) {
	const { trigger, isMutating, data } = useSWRMutation(
		'/api/studyGroups',
		async (
			url: string,
			{
				arg,
			}: {
				arg: Parameters<typeof deleteStudyGroup.apiDeleteStudyGroup>[0];
			},
		) => await deleteStudyGroup.apiDeleteStudyGroup(arg),
	);

	const session = useSession();

	const isOwner = session.data?.user?.id === group.ownerId;

	return (
		<ActionIcon
			variant="light"
			color="red"
			title="Delete group"
			onClick={() => {
				if (isOwner) {
					openConfirmModal({
						title: <ModalTitle text="Delete group confirmation" />,
						children: (
							<Stack p="sm">
								<Text>
									Are you sure that you want to delete this
									study group?
								</Text>
								<Text
									size="sm"
									color="dimmed"
								>
									This action cannot be undone. The group will
									be deleted forever and cannot be recovered
								</Text>
							</Stack>
						),
						centered: true,
						withCloseButton: false,
						shadow: 'md',
						radius: 'md',
						labels: { confirm: 'delete', cancel: 'cancel' },
						confirmProps: { variant: 'light' },
						onCancel: () => console.log('cancel'),
						onConfirm: async () => {
							closeAllModals();
							await trigger(group.id, {
								optimisticData: (current: StudyGroup[] = []) =>
									Array.isArray(current)
										? current.filter(g => g.id !== group.id)
										: [],
							});
						},
					});
				}
			}}
		>
			<BiTrash />
		</ActionIcon>
	);
}
