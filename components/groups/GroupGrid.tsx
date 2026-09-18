import { Flex, LoadingOverlay } from '@mantine/core';
import { useState } from 'react';
import { StudyGroupWithFlashcards } from 'studyGroups/crud/getMany';
import GroupCard from './GroupCard';

type Props = {
	groups: StudyGroupWithFlashcards[];
};

export default function GroupGrid({ groups }: Props) {
	const [loading, setLoading] = useState(false);

	return (
		<>
			<Flex
				gap={'sm'}
				wrap={'wrap'}
			>
				{groups?.map(g => (
					<GroupCard
						key={g.id}
						group={g}
						setLoading={setLoading}
					/>
				))}
			</Flex>
			<LoadingOverlay visible={loading} />
		</>
	);
}
