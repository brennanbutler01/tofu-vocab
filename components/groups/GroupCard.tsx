import { Card, Group, Stack, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { StudyGroupWithFlashcards } from 'studyGroups/crud/getMany';
import GroupActions from './GroupActions';
import IsPublic from './IsPublic';

type Props = {
	group: StudyGroupWithFlashcards;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function GroupCard({ group, setLoading }: Props) {
	const session = useSession();

	//TODO - send invites for public groups
	return (
		<Card
			miw={'280px'}
			radius="md"
			shadow="md"
			withBorder
			p="md"
			key={group.id}
		>
			<Stack p="sm">
				<Group position="right">
					<IsPublic
						visibility={group?.allowJoin ? 'public' : 'private'}
					/>
				</Group>
				<Card.Section inheritPadding>
					<Stack spacing="xs">
						<Text size="lg">{group?.name}</Text>
						<Text
							size="sm"
							color={'dimmed'}
						>
							{group?.description}
						</Text>
						<Text
							color="dimmed"
							mt="md"
						>
							{group?.flashcards?.length} flashcards
						</Text>
					</Stack>
					<Text
						color="dimmed"
						mt="xs"
					>
						{group?.users?.length} member
						{group?.users?.length === 1 ? '' : 's'}
					</Text>
				</Card.Section>

				<Card.Section>
					<GroupActions
						group={group}
						setLoading={setLoading}
						userId={session?.data?.user?.id as string}
					/>
				</Card.Section>
			</Stack>
		</Card>
	);
}
