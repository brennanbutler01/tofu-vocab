import { Stack, Group, Button, Text, Flex } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { FlashcardOrigins, GroupFlashcard, LeitnerBox } from '@prisma/client';
import { useBoxesSWR } from 'boxes/swr';
import createManyFlashcards from 'flashcard/crud/createMany';
import { searchFlashcards } from 'flashcard/searchFlashcards';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { BiCheck } from 'react-icons/bi';
import { FlashcardSearch } from '../flashcard/FlashcardSearch';
import GroupFlashcardGrid from './GroupFlashcardGrid';
import useSWRMutation from 'swr/mutation';
import { FlashcardWithBox } from 'flashcard/crud/getOne';

type Props = {
	cardsToCreate: GroupFlashcard[];
};

export default function GroupFlashcardModal({ cardsToCreate }: Props) {
	const [search, setSearch] = useState('');
	const filteredCards = useMemo(
		() => searchFlashcards(cardsToCreate, search) as GroupFlashcard[],
		[cardsToCreate, search],
	);
	const [selectedCards, setSelectedCards] = useState<string[]>([]);
	const { boxes } = useBoxesSWR();
	const session = useSession();
	const { trigger } = useSWRMutation(
		'/api/flashcards/ALL',
		async (
			url: string,
			{
				arg,
			}: {
				arg: Parameters<
					typeof createManyFlashcards.apiCreateManyFlashcards
				>[0];
			},
		) => await createManyFlashcards.apiCreateManyFlashcards(arg),
	);

	return (
		<Stack>
			<Group align={'end'}>
				<FlashcardSearch
					value={search}
					onChange={setSearch}
				/>
				<Flex
					direction={'column'}
					gap="xs"
				>
					<Text
						size="xs"
						color="dimmed"
					>
						Select flashcards to create
					</Text>
					<Group noWrap>
						<Button
							compact
							size="xs"
							color="cyan"
							variant="light"
							onClick={() =>
								setSelectedCards(filteredCards.map(c => c.id))
							}
							disabled={
								filteredCards?.length === 0 ||
								selectedCards.length === cardsToCreate.length
							}
						>
							select all
						</Button>
						<Button
							compact
							size="xs"
							radius="md"
							variant="light"
							color="pink"
							onClick={() => setSelectedCards([])}
							disabled={selectedCards.length === 0}
						>
							reset
						</Button>
					</Group>
				</Flex>
			</Group>
			<GroupFlashcardGrid
				groupCards={filteredCards}
				selectedCards={selectedCards}
				setSelectedCards={setSelectedCards}
			/>
			<Group position="right">
				<Button
					variant="default"
					radius="md"
					onClick={() => closeAllModals()}
				>
					{' '}
					cancel
				</Button>
				<Button
					radius="md"
					variant="light"
					color="teal"
					onClick={async () => {
						const cardsToCreate = filteredCards.map(c => ({
							front: c.front,
							back: c.back,
							userId: session?.data?.user?.id as string,
							boxId: boxes?.find(b => b.boxNumber === 0)
								?.id as string,
							created_at: new Date(),
							updated_at: new Date(),
							origin: FlashcardOrigins.GROUP,
						}));

						if (cardsToCreate.length > 0) {
							showNotification({
								color: 'teal',
								icon: <BiCheck />,
								message: 'Created flashcards',
							});
						}

						const optimisticData: FlashcardWithBox[] =
							cardsToCreate.map((c, i) => ({
								...c,
								box: boxes?.find(
									b => b.boxNumber === 0,
								) as LeitnerBox,
								id: i.toString(),
								attempts: [],
							}));

						await trigger(cardsToCreate, {
							optimisticData: current =>
								Array.isArray(current)
									? [...current, ...optimisticData]
									: [],
						});
						closeAllModals();
					}}
				>
					confirm
				</Button>
			</Group>
		</Stack>
	);
}
