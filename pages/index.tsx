import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import HomePage from '@/components/HomePage';

export default HomePage;

export const getServerSideProps = async ({
	req,
	res,
}: GetServerSidePropsContext) => {
	const session = await getServerSession(req, res, authOptions);
	let swrSession = null;

	if (session) {
		swrSession = {
			...session,
			user: {
				...session?.user,
				created_at: session?.user?.created_at?.toISOString(),
			},
		};
	}
	return {
		props: {
			session: swrSession,
		},
	};
};
