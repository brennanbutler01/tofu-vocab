import { LeitnerBox, StudyAttempt } from '@prisma/client';
import { FlashcardWithBox } from './crud/getOne';

export interface ISerializedFlashcardWithBox
	extends Omit<
		FlashcardWithBox,
		'created_at' | 'updated_at' | 'attempts' | 'box'
	> {
	created_at: string;
	updated_at: string;
	attempts: ISerializedAttempts[];
	box: ISerializedBox;
}

export interface ISerializedAttempts
	extends Omit<StudyAttempt, 'created_at' | 'updated_at'> {
	created_at: string;
	updated_at: string;
}

export interface ISerializedBox
	extends Omit<LeitnerBox, 'created_at' | 'updated_at'> {
	created_at: string;
	updated_at: string;
}

//get the full flashcard serialized
export const serializeFullFlashcard = (
	flashcards: FlashcardWithBox[],
): ISerializedFlashcardWithBox[] => {
	return flashcards.map(
		({ created_at, updated_at, box, attempts, ...rest }) => ({
			...rest,
			created_at: created_at.toString(),
			updated_at: updated_at.toString(),
			box: {
				...box,
				created_at: box.created_at.toString(),
				updated_at: box.updated_at.toString(),
			},
			attempts: attempts.map(({ created_at, updated_at, ...rest }) => ({
				...rest,
				created_at: created_at.toString(),
				updated_at: updated_at.toString(),
			})),
		}),
	);
};
