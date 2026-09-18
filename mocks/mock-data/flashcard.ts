import { Flashcard, FlashcardOrigins } from '@prisma/client';
import { FlashcardWithBox } from 'flashcard/crud/getOne';
import { attempts } from './attempts';
import { boxes } from './boxes';
export const cardSet: Flashcard[] = [
	{
		back: ['xin chao'],
		front: ['hi'],
		created_at: new Date(),
		id: '1',
		updated_at: new Date(),
		userId: '1',
		boxId: '1',
		origin: FlashcardOrigins.USER,
	},
	{
		back: ['an'],
		front: ['eat'],
		created_at: new Date(),
		id: '2',
		updated_at: new Date(),
		userId: '1',
		boxId: '1',
		origin: FlashcardOrigins.USER,
	},
	{
		back: ['chao'],
		front: ['congee'],
		created_at: new Date(),
		id: '3',
		updated_at: new Date(),
		userId: '1',
		boxId: '1',
		origin: FlashcardOrigins.USER,
	},
	{
		back: ['di lam'],
		front: ['go to work'],
		created_at: new Date(),
		id: '4',
		updated_at: new Date(),
		userId: '1',
		boxId: '1',
		origin: FlashcardOrigins.USER,
	},
	{
		back: ['ga'],
		front: ['chicken'],
		created_at: new Date(),
		id: '5',
		updated_at: new Date(),
		userId: '1',
		boxId: '1',
		origin: FlashcardOrigins.USER,
	},
	{
		back: ['truoc'],
		front: ['before'],
		created_at: new Date(),
		id: '6',
		updated_at: new Date(),
		userId: '1',
		boxId: '1',
		origin: FlashcardOrigins.USER,
	},
];
export const flashcardData: Flashcard[] = [...cardSet];

export const flashcardsWithBoxes: FlashcardWithBox[] = cardSet?.map(card => ({
	...card,
	attempts: attempts,
	box: boxes[0],
}));
