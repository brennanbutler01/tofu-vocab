import { Box } from '@mantine/core';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { searchFlashcards } from 'flashcard/searchFlashcards';
import React, { useEffect, useState } from 'react';
import { Loading } from '../Loading';
import { FlashcardList } from './FlashcardList';
import { FlashcardSearch } from './FlashcardSearch';

type Props = {
	flashcards: FlashcardWithBox[];
	setEmpty: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FlashcardSearchGrid({ flashcards, setEmpty }: Props) {
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');

	useEffect(() => {
		if (!flashcards) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [flashcards]);

	useEffect(() => {
		const filteredFlashcards = searchFlashcards(
			flashcards,
			search,
		) as FlashcardWithBox[];
		setEmpty(filteredFlashcards.length === 0);
	}, [flashcards, search, setEmpty]);

	return (
		<>
			<Box mb="lg">
				<FlashcardSearch
					value={search}
					onChange={setSearch}
				/>
			</Box>
			{loading ? (
				<Loading />
			) : (
				<FlashcardList
					data={
						searchFlashcards(
							flashcards,
							search,
						) as FlashcardWithBox[]
					}
					searching={!!search}
				/>
			)}
		</>
	);
}
