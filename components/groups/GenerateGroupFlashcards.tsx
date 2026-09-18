import { ActionIcon } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { FlashcardOrigins, GroupFlashcard } from '@prisma/client';
import { useBoxesSWR } from 'boxes/swr';
import { findDuplicates, DuplicateFilters } from 'flashcard/findDuplicates';
import { useFlashcardSWR } from 'flashcard/swr';
import { SessionProvider, useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { BiCheck } from 'react-icons/bi';
import { IoCopy } from 'react-icons/io5';
import { StudyGroupWithFlashcards } from 'studyGroups/crud/getMany';
import { v4 } from 'uuid';
import { ModalTitle } from '../ModalTitle';
import GroupFlashcardModal from './GroupFlashcardModal';

type Props = { group: StudyGroupWithFlashcards; userId: string };

export default function GenerateGroupFlashcards({ group, userId }: Props) {
	const { flashcards } = useFlashcardSWR({});
	const { boxes } = useBoxesSWR();
	const session = useSession();

	const cardsToCreate = useMemo(
		() =>
			group?.flashcards?.reduce<GroupFlashcard[]>((acc, curr) => {
				const box0 = boxes?.find(b => b.boxNumber === 0)?.id as string;
				//check for duplicates
				const hasDuplicates = findDuplicates(
					flashcards,
					//if we have a flashcard, we will update it with our new edited values
					{
						back: curr.back,
						front: curr.front,
						created_at: new Date(),
						userId,
						updated_at: new Date(),
						boxId: box0,
						id: v4(),
						origin: FlashcardOrigins.GROUP,
					},
					DuplicateFilters.PARTIAL,
				);

				if (hasDuplicates?.length > 0) {
					return acc;
				} else {
					return [...acc, curr];
				}
			}, []),
		[group?.flashcards, flashcards],
	);

	return (
		<ActionIcon
			title="create cards"
			radius="md"
			variant="light"
			color={'orange'}
			disabled={cardsToCreate.length === 0}
			onClick={async () => {
				if (cardsToCreate?.length > 0) {
					openModal({
						size: 'md',
						centered: true,
						withCloseButton: false,
						shadow: 'md',
						radius: 'md',
						title: <ModalTitle text="Generate Cards" />,
						children: (
							<SessionProvider session={session?.data}>
								<GroupFlashcardModal
									cardsToCreate={cardsToCreate}
								/>
							</SessionProvider>
						),
					});
				}
			}}
		>
			<IoCopy />
		</ActionIcon>
	);
}
