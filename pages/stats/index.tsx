import { Layout } from '@/components/Layout';
import StatsAccordion from '@/components/stats/StatsAccordion';
import { UserStats } from '@/components/stats/UserStats';
import { Group, LoadingOverlay, Stack, Text } from '@mantine/core';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import Head from 'next/head';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import userStatsCrud, { UserStats as UserStatsType } from 'user/crud/stats';
import { useStatsSWR } from 'user/swr';

type Props = {
	swrStats: UserStatsType;
};

function StatsPage({ swrStats }: Props) {
	const { userStats } = useStatsSWR(swrStats);
	return (
		<div>
			<Head>
				<title>Stats - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout>
				{userStats ? (
					<UserStats />
				) : (
					<div>
						<Text>Getting Stats...</Text>
						<LoadingOverlay visible />
					</div>
				)}
				<Stack>
					<Text
						size="xl"
						color="dimmed"
						align="center"
					>
						View more stats here
					</Text>
					<Group position="center">
						<StatsAccordion />
					</Group>
				</Stack>
			</Layout>
		</div>
	);
}
export default StatsPage;

export async function getServerSideProps({
	req,
	res,
}: GetServerSidePropsContext) {
	let session = await getServerSession(req, res, authOptions);
	if (!session?.user) {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false,
			},
		};
	} else {
		return {
			props: {
				swrStats: await userStatsCrud.getStats(session?.user?.id),
			},
		};
	}
}
