export const outOfBounds = 'Box out of bounds - only 5 boxes, 0-4 are allowed';

//determine which box we should put the flashcard in based on our answer
export const moveToBox = (isCorrect: boolean, box: number) => {
	if (!Number.isInteger(box) || box > 4 || box < 0) {
		throw new Error(outOfBounds);
	}
	if (isCorrect) {
		//if we are already at the last box, keep it there
		if (box === 4) {
			return 4;
		} else {
			return box + 1;
		}
	}
	return 0;
};
