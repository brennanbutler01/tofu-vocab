import { moveToBox, outOfBounds } from 'flashcard/moveToBox';

describe('moveToBox', () => {
	it('should throw an error if box is out of bounds', () => {
		expect(() => moveToBox(true, 5)).toThrow(outOfBounds);
	});

	it('should return 0 if we are incorrect', () => {
		expect(moveToBox(false, 2)).toEqual(0);
	});

	it('should return 1 if we are correct and in box 0', () => {
		expect(moveToBox(true, 0)).toEqual(1);
	});

	it('should return 4 if we are correct and in box 4', () => {
		expect(moveToBox(true, 4)).toEqual(4);
	});
});
