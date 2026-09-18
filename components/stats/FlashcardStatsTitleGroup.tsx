import { Button, Group, LoadingOverlay } from '@mantine/core';
import { FlashcardSources, Prisma, User } from '@prisma/client';
import { GoBook } from 'react-icons/go';
import { AppTitle } from '../AppTitle';
import useSWRMutation from 'swr/mutation';
import { useUserSWR } from 'user/swr';
import updateUser from 'user/crud/update';
import { useRouter } from 'next/router';

type Props = {
	source: FlashcardSources;
	title: string;
};

export function FlashcardStatsTitleGroup({ source, title }: Props) {
	const { user } = useUserSWR({});
	const router = useRouter();

	const { trigger, isMutating } = useSWRMutation<
		User,
		Error,
		string,
		Prisma.UserUpdateInput
	>(
		('/api/user/' + user?.id) as string,
		async (url: string, { arg }: { arg: Prisma.UserUpdateInput }) => {
			return await updateUser.apiUpdateUser(user?.id as string, arg);
		},
	);

	return (
		<Group position="apart">
			<AppTitle text={title} />
			<Button
				color="teal"
				radius="md"
				variant="light"
				leftIcon={<GoBook />}
				onClick={async () =>
					await trigger({
						flashcardSource: source,
					}).then(async () => await router.push('/study'))
				}
				loading={isMutating}
			>
				study these cards
			</Button>
			<LoadingOverlay visible={isMutating} />
		</Group>
	);
}
