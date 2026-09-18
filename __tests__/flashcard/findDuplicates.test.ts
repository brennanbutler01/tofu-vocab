import { DuplicateFilters, findDuplicates } from 'flashcard/findDuplicates';
import { cardSet } from 'mocks/mock-data/flashcard';
import { v4 as uuid } from 'uuid';

describe('Find Duplicates function should work as intended', () => {
	it('should not match the cardToSearchFor', () => {
		//the card to search for is the only element in the array, so we should have no responses
		const result = findDuplicates(
			[cardSet[0]],
			cardSet[0],
			DuplicateFilters.FULL,
		);
		expect(result).toEqual([]);
	});

	it('should return full matches if we request', () => {
		//our set of cards has no duplicates - we are adding one duplicate, so we should expect one to be returned.
		const result = findDuplicates(
			[...cardSet, { ...cardSet[0], id: uuid() }],
			cardSet[0],
			DuplicateFilters.FULL,
		);
		expect(result).toHaveLength(1);
	});

	it('should return full matches even if  we request PARTIAL', () => {
		//our set of cards has no duplicates - we are adding one duplicate, so we should expect one to be returned.
		const result = findDuplicates(
			[...cardSet, { ...cardSet[0], id: uuid() }],
			cardSet[0],
			DuplicateFilters.PARTIAL,
		);
		expect(result).toHaveLength(1);
	});

	it('should return PARTIAL matches', () => {
		//our set of cards has no duplicates - we are adding one duplicate, so we should expect one to be returned.
		const result = findDuplicates(
			[...cardSet, { ...cardSet[0], back: ['newBack'], id: uuid() }],
			cardSet[0],
			DuplicateFilters.PARTIAL,
		);
		const result2 = findDuplicates(
			[...cardSet, { ...cardSet[0], front: ['new Front'], id: uuid() }],
			cardSet[0],
			DuplicateFilters.PARTIAL,
		);
		expect(result).toHaveLength(1);
	});
});
