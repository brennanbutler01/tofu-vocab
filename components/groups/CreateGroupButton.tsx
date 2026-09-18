import { Button } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { SessionProvider, useSession } from 'next-auth/react';
import createStudyGroup from 'studyGroups/crud/create';
import { ModalTitle } from '../ModalTitle';
import { GroupForm } from './GroupForm';
import useSWRMutation from 'swr/mutation';
import { StudyGroup } from '@prisma/client';
import { useFlashcardSWR } from 'flashcard/swr';

export default function CreateGroupButton() {
	const session = useSession();
	const { trigger, isMutating } = useSWRMutation(
		'/api/studyGroups',
		async (
			url: string,
			{
				arg,
			}: {
				arg: Parameters<typeof createStudyGroup.apiCreateStudyGroup>[0];
			},
		) => await createStudyGroup.apiCreateStudyGroup(arg),
	);
	const { flashcards } = useFlashcardSWR({});

	return (
		<Button
			radius="md"
			variant="light"
			onClick={() =>
				openModal({
					title: <ModalTitle text="Create study group" />,
					shadow: 'md',
					radius: 'md',
					withCloseButton: false,
					centered: true,

					children: (
						<SessionProvider session={session?.data}>
							<GroupForm
								onSubmit={async vals => {
									await trigger(
										createStudyGroup.parseForm({
											...vals,
											userId: session?.data?.user
												?.id as string,
											userFlashcards: flashcards,
										}),
										{},
									);
								}}
							/>
						</SessionProvider>
					),
				})
			}
		>
			create group
		</Button>
	);
}
