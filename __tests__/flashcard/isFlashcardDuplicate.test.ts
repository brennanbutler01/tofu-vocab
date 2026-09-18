import { FlashcardOrigins } from '@prisma/client';
import { DuplicateFilters } from 'flashcard/findDuplicates';
import { isFlashcardDuplicate } from 'flashcard/isFlashcardDuplicate';

const searchCard = {
	id: '1',
	origin: FlashcardOrigins.USER,
	front: ['front'],
	back: ['back'],
	created_at: new Date(),
	updated_at: new Date(),
	box: 0,
	times_seen: 0,
	boxId: '1',
	userId: '1',
};

describe('isFlashcardDuplicte should correctly identify duplicate cards', () => {
	it('should return true if both sides match and we have requested a FULL match', () => {
		const res = isFlashcardDuplicate(
			['front'],
			['back'],
			searchCard,
			DuplicateFilters.FULL,
		);
		expect(res).toEqual(true);
	});

	it('should return false for a FULL match if the front does not match', () => {
		const res = isFlashcardDuplicate(
			['fronts'],
			['back'],
			searchCard,
			DuplicateFilters.FULL,
		);
		expect(res).toEqual(false);
	});

	it('should return false for a FULL match if the back does not match', () => {
		const res = isFlashcardDuplicate(
			['front'],
			['backs'],
			searchCard,
			DuplicateFilters.FULL,
		);
		expect(res).toEqual(false);
	});

	it('should return false for a FULL match if the both do not match', () => {
		const res = isFlashcardDuplicate(
			['fronts'],
			['backs'],
			searchCard,
			DuplicateFilters.FULL,
		);
		expect(res).toEqual(false);
	});

	it('should return true for a PARTIAL match if the front matches, but the back does not', () => {
		const res = isFlashcardDuplicate(
			['front'],
			['backs'],
			searchCard,
			DuplicateFilters.PARTIAL,
		);
		expect(res).toEqual(true);
	});

	it('should return true for a PARTIAL match if the back matches, but the front does not', () => {
		const res = isFlashcardDuplicate(
			['fronts'],
			['back'],
			searchCard,
			DuplicateFilters.PARTIAL,
		);
		expect(res).toEqual(true);
	});

	it('should return true for a PARTIAL match if the front and back both match', () => {
		const res = isFlashcardDuplicate(
			['front'],
			['back'],
			searchCard,
			DuplicateFilters.PARTIAL,
		);
		expect(res).toEqual(true);
	});

	it('should return false for a PARTIAL match if the front and back both do not match', () => {
		const res = isFlashcardDuplicate(
			['fronts'],
			['backs'],
			searchCard,
			DuplicateFilters.PARTIAL,
		);
		expect(res).toEqual(false);
	});
});
