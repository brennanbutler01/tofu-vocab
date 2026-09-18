import { Card, Group, LoadingOverlay } from '@mantine/core';
import { User } from '@prisma/client';
import Head from 'next/head';
import { useState } from 'react';
import updateUser from 'user/crud/update';
import { useUserSWR } from 'user/swr';
import { Layout } from '../Layout';
import UserForm, { UserFormProps } from './UserForm';
import useSWRMutation from 'swr/mutation';
import { AppTitle } from '../AppTitle';

type Props = {
	swrUser: User;
};

export default function ProfilePage({ swrUser }: Props) {
	const [editing, setEditing] = useState(false);

	const { user } = useUserSWR({ fallbackData: swrUser });

	const { trigger, isMutating } = useSWRMutation(
		'/api/user/' + user?.id,
		async (_: string, { arg }: { arg: UserFormProps }) =>
			await updateUser.apiUpdateUser(user?.id as string, arg),
	);

	return (
		<div>
			<Head>
				<title>Profile - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout>
				<AppTitle text="Profile page" />
				<Group
					mt={'lg'}
					position="center"
					h={'100%'}
				>
					<Card
						radius="md"
						withBorder
						shadow="md"
					>
						<UserForm
							user={user as User}
							cancelEditing={() => setEditing(false)}
							editing={editing}
							startEditing={() => setEditing(true)}
							onSubmit={async (vals: UserFormProps) => {
								if (user) {
									await trigger(vals, {
										optimisticData: current =>
											({
												...current,
												...vals,
											}) as User,
									});
									setEditing(false);
								}
							}}
						/>
					</Card>
				</Group>
				<LoadingOverlay visible={isMutating} />
			</Layout>
		</div>
	);
}
