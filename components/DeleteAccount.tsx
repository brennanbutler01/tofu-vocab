import { LoadingOverlay, Menu } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { BiX } from 'react-icons/bi';
import { FaTrashAlt } from 'react-icons/fa';
import deleteUser from 'user/crud/delete';
import { useUserSWR } from 'user/swr';
import { ModalTitle } from './ModalTitle';
import useSWRMutation from 'swr/mutation';

//TODO - make a loading overlay for this
export default function DeleteAccount() {
	const { push } = useRouter();
	const { user } = useUserSWR({});
	const { trigger, isMutating } = useSWRMutation(
		'/api/user/' + user?.id,
		async () => {
			return await deleteUser.apiDeleteUser(user?.id as string);
		},
		{
			optimisticData: null,
		},
	);
	return (
		<>
			<Menu.Item
				color="red"
				icon={<FaTrashAlt />}
				onClick={() =>
					openConfirmModal({
						withinPortal: true,
						modalId: 'Delete Account',
						radius: 'md',
						shadow: 'md',
						centered: true,
						title: (
							<ModalTitle text="Account deletion confirmation" />
						),
						children:
							'Are you sure that you really want to delete your account? It wont be possible to undo this action',
						labels: { confirm: 'delete', cancel: 'cancel' },
						confirmProps: {
							color: 'red',
							variant: 'light',
						},
						cancelProps: {
							variant: 'default',
						},
						onCancel: () =>
							showNotification({
								color: 'red',
								icon: <BiX />,
								message: 'Cancelled deletion.',
							}),
						onConfirm: async () => {
							if (user?.id) {
								await trigger();
								await push('/auth/deleted');
								await signOut({ redirect: false });
							}
						},
					})
				}
			>
				Delete Account
			</Menu.Item>
		</>
	);
}
