import useSWR from 'swr';
import invitationsGet from './crud/get';

export function useInvitationSWR() {
	const { data, error, isLoading } = useSWR(
		'/api/invitations',
		invitationsGet.apiGetInvitations,
	);

	return {
		data: Array.isArray(data) ? data : [],
		error,
		isLoading,
	};
}
