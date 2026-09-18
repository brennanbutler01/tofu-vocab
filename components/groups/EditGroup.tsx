import { ActionIcon } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { Prisma, StudyGroup } from '@prisma/client';
import { SessionProvider, useSession } from 'next-auth/react';
import { BiCheck, BiEdit } from 'react-icons/bi';
import { ModalTitle } from '../ModalTitle';
import { GroupForm } from './GroupForm';
import useSWRMutation from 'swr/mutation';
import studyGroupUpdate from 'studyGroups/crud/update';
import { showNotification } from '@mantine/notifications';
import useStudyGroupFlashcardSWR from 'studyGroupFlashcards/swr';
import { StudyGroupWithFlashcards } from 'studyGroups/crud/getMany';
import { useFlashcardSWR } from 'flashcard/swr';
import { FlashcardWithBox } from 'flashcard/crud/getOne';

type Props = { group: StudyGroupWithFlashcards };

export default function EditGroup({ group }: Props) {
	const session = useSession();
	const { trigger } = useSWRMutation(
		'/api/studyGroups',
		async (
			url: string,
			{
				arg,
			}: {
				arg: Parameters<typeof studyGroupUpdate.apiUpdateStudyGroup>[0];
			},
		) => await studyGroupUpdate.apiUpdateStudyGroup(arg, group.id),
	);
	const { flashcards: groupFlashcards } = useStudyGroupFlashcardSWR();
	const { flashcards } = useFlashcardSWR({});
	console.log('study group flashcards', groupFlashcards);

	return (
		<ActionIcon
			variant="light"
			color="cyan"
			title="Edit group"
			radius="md"
			onClick={() =>
				openModal({
					withCloseButton: false,
					centered: true,
					title: <ModalTitle text="Edit Group" />,
					children: (
						<SessionProvider session={session?.data}>
							<GroupForm
								group={group}
								onSubmit={async vals => {
									console.log(vals);
									showNotification({
										color: 'teal',
										message: 'Updated Group',
										icon: <BiCheck />,
									});

									//flashcards we need to create
									const flashcardsToCreate =
										vals.flashcards[1].reduce<
											Prisma.GroupFlashcardCreateManyStudyGroupInput[]
										>(
											(acc, curr) => {
												//check to see if we already have this one in our group
												const alreadyInGroup =
													//if this flashcard has an id that matches the current flashcard id
													group.flashcards.some(
														gfc =>
															gfc.id ===
															curr.value,
													);

												//get the full flashcard for this group flashcard
												const fullFlashcard =
													flashcards?.find(
														fc =>
															fc.id ===
															curr.value,
													) as FlashcardWithBox;

												//if the card is one we already had, do nothing
												if (alreadyInGroup) {
													return acc;
												}

												//else we need to get ready to make a new card
												return [
													...acc,
													{
														front: fullFlashcard?.front,
														back: fullFlashcard?.back,
													},
												];
											},

											[],
										);

									await trigger(
										{
											allowJoin: vals.isPublic,
											description: vals.description,
											name: vals.name,
											flashcards: {
												createMany: {
													data: flashcardsToCreate,
												},
												deleteMany:
													group?.flashcards?.reduce<
														{ id: string }[]
													>((acc, curr) => {
														//if our group flashcard does not exist in the updated flashcards
														if (
															!vals.flashcards[1].find(
																fc =>
																	fc.value ===
																	curr.id,
															)
														) {
															return [
																...acc,
																{ id: curr.id },
															];
														}
														return acc;
													}, []),
												// connectOrCreate: vals.flashcards?.map(fc => )
											},
										} as Prisma.StudyGroupUpdateInput,
										{},
									);
								}}
							/>
						</SessionProvider>
					),
					shadow: 'md',
					radius: 'md',
				})
			}
		>
			<BiEdit />
		</ActionIcon>
	);
}
