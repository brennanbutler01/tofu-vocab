import useSWR from 'swr';
import getManyBoxes from './crud/getMany';

export function useBoxesSWR() {
	const { data, error } = useSWR('/api/boxes', getManyBoxes.apiGetManyBoxes);
	return {
		boxes: data,
		isLoading: !error && !data,
		isError: error,
	};
}
