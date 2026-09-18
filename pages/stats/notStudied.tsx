import NotStudiedPage from '@/components/stats/NotStudied';
import flashcardsGet from 'flashcard/crud/getMany';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { serializeFullFlashcard } from 'flashcard/serialize';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default NotStudiedPage;

export const getServerSideProps = async ({
	req,
	res,
}: GetServerSidePropsContext) => {
	const session = await getServerSession(req, res, authOptions);
	let notYetStudied: FlashcardWithBox[] = [];

	if (session?.user?.id) {
		notYetStudied = await flashcardsGet.dbGetFlashcardsNotYetStudied(
			session?.user?.id,
		);
	} else {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false,
			},
		};
	}

	return { props: { notYetStudied: serializeFullFlashcard(notYetStudied) } };
};
