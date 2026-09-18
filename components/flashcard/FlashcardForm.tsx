import { Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { Flashcard, FlashcardOrigins } from '@prisma/client';
import { DuplicateFilters, findDuplicates } from 'flashcard/findDuplicates';
import { useFlashcardSWR } from 'flashcard/swr';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiCheck, BiX } from 'react-icons/bi';
import { FormBody } from './FormBody';

export type FormValues = {
	card: {
		front: string;
		back: string;
	};
};

type Props = {
	onReset: () => void;
	onSubmit: (vals: FormValues['card']) => Promise<void>;
	editing?: boolean;
	flashcard?: Flashcard;
	wordToPopulate?: { word: string; translation?: string };
};

export const FlashcardForm = ({
	onReset,
	onSubmit,
	editing = false,
	flashcard,
	wordToPopulate,
}: Props) => {
	const [isSaving, setIsSaving] = useState(false);
	const [ignoreDuplicates, setIgnoreDuplicates] = useState(false);
	const { flashcards } = useFlashcardSWR({});
	const session = useSession();

	const form = useForm<FormValues>({
		initialValues: {
			card: {
				front:
					flashcard?.front?.join(', ') || wordToPopulate?.word || '',
				back:
					flashcard?.back?.join(', ') ||
					wordToPopulate?.translation ||
					'',
			},
		},

		transformValues: vals => ({
			card: {
				front: vals.card.front.trim(),
				back: vals.card.back.trim(),
			},
		}),
	});

	return (
		<form
			name="flashcard-form"
			id="flashcard-form"
			onSubmit={form.onSubmit(async vals => {
				if (isSaving) return;
				const searchFlashcard = (flashcard && {
					...flashcard,
					front: vals.card.front.split(','),
					back: vals.card.back.split(','),
				}) || {
					//or we will make a dummy item to check the front and back against
					id: '0',
					front: vals.card.front.split(','),
					back: vals.card.back.split(','),
					created_at: new Date(),
					updated_at: new Date(),
					userId: session?.data?.user?.id || '',
					boxId: '1',
					origin: FlashcardOrigins.USER,
				};

				const hasDuplicates = findDuplicates(
					flashcards,
					//if we have a flashcard, we will update it with our new edited values
					searchFlashcard,
					DuplicateFilters.PARTIAL,
				);

				if (hasDuplicates?.length > 0 && !ignoreDuplicates) {
					form.setErrors({ card: 'You have duplicates.' });
				} else {
					setIsSaving(true);
					try {
						await onSubmit(vals.card);
						closeAllModals();
						showNotification({
							message: (
								<Text
									size="lg"
									color="dimmed"
									weight={700}
								>
									{editing ? 'Updated' : 'Created'} flashcard
								</Text>
							),
							icon: <BiCheck size={30} />,
						});
					} catch {
						showNotification({
							color: 'red',
							message:
								'Could not save your flashcard. Your text is still here. Please try again.',
						});
					} finally {
						setIsSaving(false);
					}
				}
			})}
			onReset={() => {
				onReset();
				showNotification({
					message: (
						<Text
							size="lg"
							color="dimmed"
							weight={700}
						>
							Cancelled
						</Text>
					),
					color: 'red',
					icon: <BiX size={30} />,
				});
			}}
		>
			<FormBody
				isSaving={isSaving}
				form={form}
				editing={editing}
				hasDuplicates={!!form.errors.card}
				setIgnoreDuplicates={setIgnoreDuplicates}
			/>
		</form>
	);
};
