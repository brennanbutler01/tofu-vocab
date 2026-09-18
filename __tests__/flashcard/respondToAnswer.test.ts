import { moveToBox, outOfBounds } from 'flashcard/moveToBox';

describe('moveToBox function should work as intended', () => {
	it('should return 0 if we are incorrect', () => {
		const res = moveToBox(false, 4);
		expect(res).toBe(0);
	});

	it('should return 4 if we are correct and at the last box', () => {
		const res = moveToBox(true, 4);
		expect(res).toBe(4);
	});

	it('should return the passed in box + 1 if we are correct and not at the last box', () => {
		const res = moveToBox(true, 3);
		expect(res).toBe(4);
		expect(moveToBox(true, 0)).toBe(1);
	});

	it('should throw an error if we pass a box less than 0', () => {
		try {
			moveToBox(true, -1);
		} catch (err) {
			expect(err).toEqual(new Error(outOfBounds));
		}
	});

	it('should throw an error if we pass a box greater than 4', () => {
		try {
			moveToBox(true, 5);
		} catch (err) {
			expect(err).toEqual(new Error(outOfBounds));
		}
	});
});
