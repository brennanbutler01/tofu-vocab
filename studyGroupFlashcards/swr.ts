import useSWR from 'swr';
import getManyStudyGroupFlashcards from './crud/getMany';

export default function useStudyGroupFlashcardSWR() {
	const { data, error, isLoading } = useSWR(
		'/api/studyGroupFlashcards',
		getManyStudyGroupFlashcards.apiGetStudyGroupFlashcards,
	);

	return {
		flashcards: data,
		error,
		isLoading,
	};
}
