import { FlashcardSources } from '@prisma/client';
import useSWR from 'swr';
import flashcardsGet from './crud/getMany';
import { FlashcardWithBox } from './crud/getOne';

type Props = {
	fallbackData?: FlashcardWithBox[];
	source?: FlashcardSources;
};

export const useFlashcardSWR = ({ fallbackData, source = 'ALL' }: Props) => {
	const fetcher = async () => await flashcardsGet.apiGetFlashcards(source);
	const { isLoading, data, error, isValidating } = useSWR(
		'/api/flashcards/' + source,
		fetcher,
		{
			fallbackData,
			// revalidateOnFocus: false,
		},
	);

	return {
		flashcards: data || [],
		error: error,
		isLoading: isLoading || isValidating,
	};
};

export const useDuplicateFlashcardSWR = (id: string) => {
	const fetcher = async () => await flashcardsGet.apiGetDuplicateCards(id);
	const { data, error, isLoading } = useSWR(
		'/api/flashcard/duplicateFlashcard/' + id,
		fetcher,
	);

	return { duplicateFlashcards: data, error, isLoading };
};
