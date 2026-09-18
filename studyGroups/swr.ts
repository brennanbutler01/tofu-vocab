import useSWR from 'swr';
import getManyStudyGroups from './crud/getMany';

export function useStudyGroupSWR() {
	const { data, error, isLoading } = useSWR(
		'/api/studyGroups',
		getManyStudyGroups.apiGetStudyGroups,
	);

	return {
		data,
		error,
		isLoading,
	};
}
