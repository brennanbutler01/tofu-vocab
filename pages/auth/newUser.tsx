import { Layout } from '@/components/Layout';
import UserForm, { UserFormProps } from '@/components/profile/UserForm';
import { Card, Group } from '@mantine/core';
import { User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import getUser from 'user/crud/getOne';
import updateUser from 'user/crud/update';
import { useUserSWR } from 'user/swr';
import Head from 'next/head';

type Props = {
	swrUser: User;
};

export default function NewUser({ swrUser }: Props) {
	const { user } = useUserSWR({ fallbackData: swrUser });
	const { trigger } = useSWRMutation(
		'/api/user/' + user?.id,
		async (_: string, { arg }: { arg: UserFormProps }) =>
			await updateUser.apiUpdateUser(user?.id as string, arg),
	);
	const [editing, setEditing] = useState(true);
	return (
		<div>
			<Head>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<title>New User Profile - tofu.vocab</title>
			</Head>
			<Layout>
				<Group
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
			</Layout>
		</div>
	);
}

export const getServerSideProps = async ({
	req,
	res,
}: GetServerSidePropsContext) => {
	const session = await getServerSession(req, res, authOptions);
	let user = null;

	if (session?.user?.id) {
		user = await getUser.dbGetUser(session?.user?.id);
	} else {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false,
			},
		};
	}

	return {
		props: {
			session: {
				...session,
				user: {
					...session?.user,
					created_at: session?.user?.created_at?.toISOString(),
				},
			},
			swrUser: { ...user, created_at: user?.created_at?.toISOString() },
		},
	};
};
