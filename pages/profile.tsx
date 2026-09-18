import ProfilePage from '@/components/profile';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import getUser from 'user/crud/getOne';
import { authOptions } from './api/auth/[...nextauth]';

export default ProfilePage;

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
