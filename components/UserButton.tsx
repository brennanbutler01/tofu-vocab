import { Button, Group } from '@mantine/core';
import { signIn, useSession } from 'next-auth/react';
import { useUserSWR } from 'user/swr';
import UserMenu from './UserMenu';

export default function UserButton() {
	const session = useSession();
	const { user } = useUserSWR({});

	return (
		<Group position="center">
			{user && session.status === 'authenticated' && user ? (
				<UserMenu user={user} />
			) : (
				<Button
					radius="md"
					fullWidth
					variant="subtle"
					loading={session?.status === 'loading' || !user}
					onClick={async () => await signIn()}
				>
					{session?.status === 'loading' || !user
						? 'loading...'
						: 'sign in'}
				</Button>
			)}
		</Group>
	);
}
