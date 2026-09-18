import {
	Button,
	Card,
	Checkbox,
	Group,
	Stack,
	Textarea,
	TextInput,
	TransferListData,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';
import { useFlashcardSWR } from 'flashcard/swr';
import { useMemo } from 'react';
import { StudyGroupWithFlashcards } from 'studyGroups/crud/getMany';
import GroupFlashcard from './GroupFlashcard';

export type GroupForm = {
	name: string;
	description: string;
	isPublic: boolean;
	flashcards: TransferListData;
};

type Props = {
	group?: StudyGroupWithFlashcards;
	onSubmit: (vals: GroupForm) => void;
};

export function GroupForm({ group, onSubmit }: Props) {
	const { flashcards } = useFlashcardSWR({});

	const preparedFlashcards: TransferListData = useMemo(() => {
		const groupFlashcards = group?.flashcards || [];
		const filteredFlashcards = flashcards?.filter(
			fc =>
				!groupFlashcards?.some(({ front, back }) =>
					fc.front.every(
						word =>
							front.some(w => w === word) &&
							fc.back.every(word => back.some(w => w === word)),
					),
				),
		);
		return [
			filteredFlashcards?.map(fc => ({
				label: fc.front.join(', '),
				value: fc.id,
			})),
			groupFlashcards?.map(fc => ({
				label: fc.front.join(', '),
				value: fc.id,
			})),
		];
	}, [group, flashcards]);

	const groupForm = useForm<GroupForm>({
		initialValues: {
			name: group?.name || '',
			description: group?.description || '',
			isPublic: group?.allowJoin || false,
			flashcards: preparedFlashcards,
		},
	});

	return (
		<Card
			radius={'md'}
			shadow="md"
			p="lg"
		>
			<form
				name="study-group-form"
				onSubmit={groupForm.onSubmit(async vals => {
					closeAllModals();
					onSubmit(vals);
				})}
				onReset={() => {
					groupForm.reset();
					closeAllModals();
				}}
			>
				<Stack spacing="xl">
					<TextInput
						label="Name"
						placeholder="Vietnamese buddies"
						required
						{...groupForm.getInputProps('name')}
					/>
					<Textarea
						required
						label="Description"
						placeholder="A group for learning Vietnamese with new friends..."
						{...groupForm.getInputProps('description')}
					/>
					<Checkbox
						label="Is public?"
						description="Public groups can be joined and viewed by anyone. Private groups can only be joined by invitation."
						{...groupForm.getInputProps('isPublic', {
							type: 'checkbox',
						})}
					/>
					<GroupFlashcard form={groupForm} />
					<Group
						position="right"
						mt="lg"
					>
						<Button
							radius="md"
							variant="default"
							type="reset"
						>
							cancel
						</Button>
						<Button
							radius="md"
							color="teal"
							variant="light"
							type="submit"
						>
							{group ? 'update' : 'create'}
						</Button>
					</Group>
				</Stack>
			</form>
		</Card>
	);
}
