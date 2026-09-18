import { Prisma } from '@prisma/client';
import { LoadingOverlay, Menu } from '@mantine/core';
import { closeAllModals, openModal } from '@mantine/modals';
import flashcardUpdate from 'flashcard/crud/update';
import { useFlashcardSWR } from 'flashcard/swr';
import { SessionProvider } from 'next-auth/react';
import { ModalTitle } from '../ModalTitle';
import { FlashcardForm, FormValues } from './FlashcardForm';
import useSWRMutation from 'swr/mutation';
import { FlashcardWithBox } from 'flashcard/crud/getOne';

type Props = {
	flashcard: FlashcardWithBox;
};

export function EditItem({ flashcard }: Props) {
	const { flashcards } = useFlashcardSWR({});
	const { trigger, isMutating } = useSWRMutation<
		FlashcardWithBox[],
		Error,
		string,
		Prisma.FlashcardUpdateInput
	>(
		'/api/flashcards/ALL',
		async (url: string, { arg }: { arg: Prisma.FlashcardUpdateInput }) => {
			return await flashcardUpdate
				.apiUpdateFlashcard(flashcard.id, arg)
				.then(updatedFlashcard =>
					flashcards?.map(card =>
						card.id === updatedFlashcard.id
							? { ...card, ...updatedFlashcard }
							: card,
					),
				);
		},
	);
	const openEditModal = () => {
		openModal({
			children: (
				<SessionProvider>
					<FlashcardForm
						onReset={closeAllModals}
						onSubmit={async (vals: FormValues['card']) => {
							await flashcardUpdate.updateFlashcard({
								trigger,
								flashcardId: flashcard.id,
								updatedFlashcard: {
									front: vals.front.split(','),
									back: vals.back.split(','),
								},
							});
						}}
						editing
						flashcard={flashcard}
					/>
				</SessionProvider>
			),
			title: <ModalTitle text="Edit Flashcard" />,
			shadow: 'lg',
			centered: true,
			withCloseButton: false,
		});
	};

	return (
		<div>
			<Menu.Item onClick={openEditModal}>edit</Menu.Item>
			<LoadingOverlay visible={isMutating} />
		</div>
	);
}
