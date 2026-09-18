import { Divider, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { checkAnswer } from 'flashcard/checkAnswer';
import { FlashcardAsQuestion } from './FlashcardAsQuestion';
import { StudyFormBody } from './StudyFormBody';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { AnswerType } from '.';
import { Prisma, StudySides, User } from '@prisma/client';
import { useBoxesSWR } from 'boxes/swr';
import flashcardUpdate from 'flashcard/crud/update';
import updateUser from 'user/crud/update';
import { useUserSWR } from 'user/swr';
import useSWRMutation from 'swr/mutation';
import { useEffect } from 'react';
import { useDuplicateFlashcardSWR } from 'flashcard/swr';
import flashcardsGet from 'flashcard/crud/getMany';

export type AnwswerValues = { answer: string };

type Props = {
	flashcard: FlashcardWithBox;
	setAnswer: React.Dispatch<React.SetStateAction<AnswerType | undefined>>;
	side: StudySides;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export function StudyForm({ flashcard, setAnswer, side, setLoading }: Props) {
	const form = useForm<AnwswerValues>({
		initialValues: {
			answer: '',
		},
	});
	const { boxes } = useBoxesSWR();
	const { user } = useUserSWR({});
	const { trigger, isMutating } = useSWRMutation<
		FlashcardWithBox[],
		Error,
		string,
		Prisma.FlashcardUpdateInput
	>(
		'/api/flashcards/' + user?.flashcardSource,
		async (url: string, { arg }: { arg: Prisma.FlashcardUpdateInput }) => [
			await flashcardUpdate.apiUpdateFlashcard(flashcard.id, arg),
		],
	);

	const { trigger: userTrigger, isMutating: isMutatingUser } = useSWRMutation<
		User,
		Error,
		string,
		Prisma.UserUpdateInput
	>(
		('/api/user/' + user?.id) as string,
		async (_: string, { arg }: { arg: Prisma.UserUpdateInput }) => {
			return await updateUser.apiUpdateUser(user?.id as string, arg);
		},
	);

	const { duplicateFlashcards } = useDuplicateFlashcardSWR(flashcard.id);

	useEffect(() => {
		if (isMutating || isMutatingUser) {
			setLoading(true);
		}
	}, [isMutating, isMutatingUser]);

	const postAnswer = async (vals: AnwswerValues) => {
		if (user) {
			try {
				await Promise.all([
					flashcardUpdate.answerFlashcard({
						id: flashcard.id,
						trigger,
						updateFlashcard: flashcardUpdate.parseFormAnswer({
							isCorrect: checkAnswer(
								duplicateFlashcards
									? flashcardsGet.reduceDuplicateFrontBack(
											duplicateFlashcards,
										)
									: flashcard,
								vals.answer.split(','),
								side,
							),
							flashcard,
							side,
							userId: user?.id as string,
							answer: vals.answer.split(','),
						}),
						userBoxes: boxes || [],
						source: user?.flashcardSource,
					}),
					updateUser.updateStreak({
						trigger: userTrigger,
						user,
						isCorrect: checkAnswer(
							duplicateFlashcards
								? flashcardsGet.reduceDuplicateFrontBack(
										duplicateFlashcards,
									)
								: flashcard,
							vals.answer.split(','),
							side,
						),
					}),
				]);
			} catch (err) {
				console.log(err);
			}
		}
	};

	console.log('duplicate flashcards', duplicateFlashcards);
	return (
		<Stack>
			<FlashcardAsQuestion
				flashcard={flashcard}
				side={side}
			/>
			<Divider />
			<form
				aria-label="answer-form"
				name="answer-form"
				id="answer-form"
				onSubmit={form.onSubmit(async (vals: AnwswerValues) => {
					const isCorrect = checkAnswer(
						duplicateFlashcards
							? flashcardsGet.reduceDuplicateFrontBack(
									duplicateFlashcards,
								)
							: flashcard,
						vals.answer.split(','),
						side,
					);
					console.log('isCorrect', isCorrect);
					setAnswer({
						answer: vals.answer,
						flashcard: duplicateFlashcards
							? {
									...flashcard,
									front:
										side === 'FRONT'
											? flashcard.front
											: flashcardsGet.reduceDuplicateFrontBack(
													duplicateFlashcards,
												)?.front,
									back:
										side === 'BACK'
											? flashcard.back
											: flashcardsGet.reduceDuplicateFrontBack(
													duplicateFlashcards,
												)?.back,
								}
							: flashcard,
						isCorrect,
						side,
					});
					await postAnswer({ answer: vals.answer });
				})}
				onReset={form.reset}
			>
				<StudyFormBody form={form} />
			</form>
		</Stack>
	);
}
