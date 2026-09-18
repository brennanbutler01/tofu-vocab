import { ISerializedFlashcardWithBox } from './serialize';

//deserialize the full flashcards
export const deserializeFullFlashcard = (
	flashcards: ISerializedFlashcardWithBox[],
) => {
	return flashcards?.map(
		({ created_at, updated_at, box, attempts, ...rest }) => ({
			...rest,
			created_at: new Date(created_at),
			updated_at: new Date(updated_at),
			box: {
				...box,
				created_at: new Date(box.created_at),
				updated_at: new Date(box.updated_at),
			},
			attempts: attempts.map(({ created_at, updated_at, ...rest }) => ({
				...rest,
				created_at: new Date(created_at),
				updated_at: new Date(updated_at),
			})),
		}),
	);
};
