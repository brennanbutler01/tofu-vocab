import { ActionIcon } from '@mantine/core';
import { useSession } from 'next-auth/react';
import useSWRMutation from 'swr/mutation';
import { BiUnlink } from 'react-icons/bi';
import { StudyGroupWithFlashcards } from 'studyGroups/crud/getMany';
import studyGroupUpdate from 'studyGroups/crud/update';

type Props = { group: StudyGroupWithFlashcards };

export default function UnlinkGroup({ group }: Props) {
	const session = useSession();

	const { trigger } = useSWRMutation(
		'/api/studyGroups',
		async (url: string, { arg }) =>
			await studyGroupUpdate.apiUpdateStudyGroup(
				{ users: { disconnect: { id: session?.data?.user?.id } } },
				group.id,
			),
	);
	return (
		<ActionIcon
			radius="md"
			color="teal"
			variant="light"
			title="Leave group"
			onClick={async () => {
				console.log('unlinking...');
				await trigger(undefined, {
					optimisticData: (
						current: StudyGroupWithFlashcards[] = [],
					) =>
						current.map(c =>
							c.id === group.id
								? {
										...c,
										users: c.users.filter(
											u =>
												u.id !==
												session?.data?.user?.id,
										),
									}
								: c,
						),
				});
			}}
		>
			<BiUnlink />
		</ActionIcon>
	);
}
