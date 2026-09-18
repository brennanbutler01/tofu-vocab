import { Flashcard } from '@prisma/client';
import { searchFlashcards } from 'flashcard/searchFlashcards';
import { flashcardData } from 'mocks/mock-data/flashcard';

describe('Search Flashcards function should work as intended', () => {
	it('should return all of the flashcards if we have no search', () => {
		const flashcards = flashcardData;
		expect(searchFlashcards(flashcards, '')).toHaveLength(
			flashcards?.length,
		);
	});

	it('should return an item if the front of the flashcard contains the search term', () => {
		const flashcards: Flashcard[] = [
			{
				id: '1',
				origin: 'USER',
				front: ['front'],
				back: ['back'],
				boxId: '1',
				userId: '1',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: '2',
				origin: 'USER',
				front: ['mew'],
				back: ['hi'],
				boxId: '1',
				created_at: new Date(),
				userId: '1',
				updated_at: new Date(),
			},
		];
		expect(searchFlashcards(flashcards, 'mew')).toEqual([flashcards[1]]);
	});

	it('should return an item if the back of the flashcard contains the search term', () => {
		const flashcards: Flashcard[] = [
			{
				id: '1',
				origin: 'USER',
				front: ['front'],
				back: ['back'],
				boxId: '1',
				userId: '1',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: '2',
				origin: 'USER',
				front: ['mew'],
				back: ['hi'],
				boxId: '1',
				userId: '1',
				created_at: new Date(),
				updated_at: new Date(),
			},
		];
		expect(searchFlashcards(flashcards, 'front')).toEqual([flashcards[0]]);
	});

	it('should search the front and back at the same time', () => {
		const flashcards: Flashcard[] = [
			{
				id: '1',
				origin: 'USER',
				front: ['mount'],
				back: ['back'],
				boxId: '1',
				created_at: new Date(),
				userId: '1',
				updated_at: new Date(),
			},
			{
				id: '2',
				origin: 'USER',
				front: ['mew'],
				back: ['hi'],
				boxId: '1',
				userId: '1',
				created_at: new Date(),
				updated_at: new Date(),
			},
		];
		expect(searchFlashcards(flashcards, 'm')).toHaveLength(2);
	});
});
