import { Menu } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { BiCheck, BiX } from 'react-icons/bi';
import { ModalTitle } from '../ModalTitle';

type Props = {
	onConfirm: () => Promise<void>;
};

export function DeleteItem({ onConfirm }: Props) {
	const openDeleteModal = () =>
		openConfirmModal({
			children: 'Are you sure you want to delete this card?',
			title: <ModalTitle text="Delete Flashcard" />,
			labels: {
				cancel: 'cancel',
				confirm: 'confirm',
			},
			onConfirm: async () => {
				await onConfirm();
				showNotification({
					message: 'Deleted Flashcard',
					color: 'teal',
					icon: <BiCheck size={30} />,
				});
			},
			onCancel: () => {
				showNotification({
					color: 'red',
					icon: <BiX size={30} />,
					message: 'Cancelled',
				});
			},
			confirmProps: {
				variant: 'light',
				color: 'teal',
			},
			withCloseButton: false,
			centered: true,
			radius: 'md',
			shadow: 'lg',
		});
	return <Menu.Item onClick={openDeleteModal}>delete</Menu.Item>;
}
