import useSWR from 'swr';
import getWords from './get';

export function useWordsSWR() {
	const { data, error, isLoading } = useSWR(
		'/api/words',
		getWords.apiGetWord,
	);
	return {
		word: data,
		loading: isLoading,
		error,
	};
}
