import Box4Page from '@/components/stats/Box4Page';
import flashcardsGet from 'flashcard/crud/getMany';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { serializeFullFlashcard } from 'flashcard/serialize';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default Box4Page;

export const getServerSideProps = async ({
	req,
	res,
}: GetServerSidePropsContext) => {
	const session = await getServerSession(req, res, authOptions);
	let flashcards: FlashcardWithBox[] = [];

	if (session?.user?.id) {
		flashcards = await flashcardsGet.dbGetFlashcardsInBox4(
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
			box4: serializeFullFlashcard(flashcards),
		},
	};
};
