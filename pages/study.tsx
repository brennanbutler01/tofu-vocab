import StudyPage from '@/components/study/index';
import flashcardsGet from 'flashcard/crud/getMany';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { transformMockedData } from 'utils/transformMockedData';
import { authOptions } from './api/auth/[...nextauth]';

export default StudyPage;

export const getServerSideProps = async ({
	req,
	res,
}: GetServerSidePropsContext) => {
	const session = await getServerSession(req, res, authOptions);
	let swrSession = null;
	let swrStudyCards: FlashcardWithBox[] = [];

	if (session?.user?.id) {
		swrStudyCards = await flashcardsGet.getFlashcardFetcher(
			session.user.flashcardSource,
			session.user?.id,
		);
	} else {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false,
			},
		};
	}

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
			swrUser: {
				...session?.user,
				created_at: session?.user?.created_at?.toISOString() || null,
			},
			studyCards: swrStudyCards.map(card => ({
				...transformMockedData(card),
				box: transformMockedData(card.box),
				attempts: card.attempts.map(transformMockedData),
			})),
		},
	};
};
