import { ActionIcon } from '@mantine/core';
import { BiLink } from 'react-icons/bi';
import { StudyGroupWithFlashcards } from 'studyGroups/crud/getMany';
import { useSession } from 'next-auth/react';
import useSWRMutation from 'swr/mutation';
import studyGroupUpdate from 'studyGroups/crud/update';

type Props = { group: StudyGroupWithFlashcards };

export default function LinkGroup({ group }: Props) {
	const session = useSession();

	const { trigger } = useSWRMutation(
		'/api/studyGroups',
		async (url: string, { arg }) =>
			await studyGroupUpdate.apiUpdateStudyGroup(
				{ users: { connect: { id: session?.data?.user?.id } } },
				group.id,
			),
	);
	return (
		<ActionIcon
			title="Join group"
			radius="md"
			color="teal"
			variant="light"
			onClick={async () => {
				console.log('inking');
				await trigger(undefined, {});
			}}
		>
			<BiLink />
		</ActionIcon>
	);
}
