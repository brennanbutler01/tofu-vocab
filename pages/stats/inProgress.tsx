import InProgressPage from '@/components/stats/InProgressPage';
import flashcardsGet from 'flashcard/crud/getMany';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { serializeFullFlashcard } from 'flashcard/serialize';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default InProgressPage;

export const getServerSideProps = async ({
	req,
	res,
}: GetServerSidePropsContext) => {
	const session = await getServerSession(req, res, authOptions);
	let flashcards: FlashcardWithBox[] = [];

	if (session?.user?.id) {
		flashcards = await flashcardsGet.dbGetFlashcardsInProgress(
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

	return {
		props: {
			inProgress: serializeFullFlashcard(flashcards),
		},
	};
};
