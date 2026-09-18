import FlashcardsPage from '@/components/flashcard';
import flashcardsGet from 'flashcard/crud/getMany';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { serializeFullFlashcard } from 'flashcard/serialize';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

export default FlashcardsPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const session = await getServerSession(ctx.req, ctx.res, authOptions);
	let flashcards: FlashcardWithBox[] = [];

	if (session?.user?.id) {
		flashcards = await flashcardsGet.dbGetFlashcards(session?.user?.id);
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
			data: serializeFullFlashcard(flashcards),
		},
	};
};
