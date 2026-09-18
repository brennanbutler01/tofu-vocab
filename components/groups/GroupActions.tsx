import { Group } from '@mantine/core';
import { StudyGroupWithFlashcards } from 'studyGroups/crud/getMany';
import DeleteGroup from './DeleteGroup';
import EditGroup from './EditGroup';
import GenerateGroupFlashcards from './GenerateGroupFlashcards';
import LinkGroup from './LinkGroup';
import UnlinkGroup from './UnlinkGroup';
import InviteButton from '@/components/groups/InviteButton';

type Props = {
	userId: string;
	group: StudyGroupWithFlashcards;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function GroupActions({ group, userId, setLoading }: Props) {
	const isOwner = group?.ownerId === userId;
	const isMember = group?.users?.some(u => u.id === userId);

	const ownerItems = [
		<DeleteGroup
			group={group}
			setLoading={setLoading}
			key="delete"
		/>,
		<EditGroup
			group={group}
			key="edit"
		/>,
		<InviteButton
			group={group}
			key={'invite'}
		/>,
	];

	const memberItems = [
		<GenerateGroupFlashcards
			key="generatecards"
			group={group}
			userId={userId}
		/>,
		<UnlinkGroup
			group={group}
			key="unlink"
		/>,
		<InviteButton
			group={group}
			key={'invite'}
		/>,
	];

	const strangerItems = [
		<LinkGroup
			group={group}
			key="link"
		/>,
	];

	return (
		<Group position="right">
			{isOwner ? ownerItems : isMember ? memberItems : strangerItems}
		</Group>
	);
}
