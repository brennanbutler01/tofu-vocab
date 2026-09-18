import { ActionIcon, Menu } from '@mantine/core';
import flashcardDelete from 'flashcard/crud/delete';
import { useFlashcardSWR } from 'flashcard/swr';
import { FaEllipsisH } from 'react-icons/fa';
import { DeleteItem } from './DeleteItem';
import { EditItem } from './EditItem';
import useSWRMutation from 'swr/mutation';
import { FlashcardWithBox } from 'flashcard/crud/getOne';

type Props = {
	flashcard: FlashcardWithBox;
};

export function FlashcardMenu({ flashcard }: Props) {
	const { flashcards } = useFlashcardSWR({});

	const { trigger } = useSWRMutation<
		FlashcardWithBox[],
		Error,
		string,
		string
	>('/api/flashcards/ALL', async (url: string, { arg }: { arg: string }) => {
		return await flashcardDelete
			.apiDeleteFlashcard(arg)
			.then(() => flashcards?.filter(card => card.id !== arg));
	});

	const deleteItem = async () => {
		try {
			await flashcardDelete.deleteFlashcard({
				id: flashcard.id,
				trigger,
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Menu
			shadow={'md'}
			width={150}
			withinPortal
		>
			<Menu.Target>
				<ActionIcon title="flashcard-menu-button">
					<FaEllipsisH />
				</ActionIcon>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Label>Flashcard</Menu.Label>
				<Menu.Divider />
				<EditItem flashcard={flashcard} />
				<Menu.Divider />
				<DeleteItem onConfirm={deleteItem} />
			</Menu.Dropdown>
		</Menu>
	);
}
