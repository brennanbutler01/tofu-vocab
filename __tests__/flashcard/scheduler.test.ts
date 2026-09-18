import {
	getFlashcardInRandomBox,
	selectFlashcardForStudy,
	isDueForStudy,
} from 'flashcard/prepareFlashcardForStudy';
import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';
import { moveToBox } from 'flashcard/moveToBox';

const card = (id: string, box: number, daysAgo?: number) => ({
	...flashcardsWithBoxes[0],
	id,
	box: { ...flashcardsWithBoxes[0].box, boxNumber: box },
	attempts:
		daysAgo === undefined
			? []
			: [
					{
						id: 'attempt-' + id,
						flashcardId: id,
						userId: 'synthetic',
						isCorrect: true,
						created_at: new Date(Date.now() - daysAgo * 86400000),
						updated_at: new Date(),
					},
			  ],
});

describe('study scheduling regressions', () => {
	it('returns null when no cards exist', () =>
		expect(selectFlashcardForStudy([])).toBeNull());
	it('terminates when the only populated box has low probability', () => {
		const only = card('only', 4, 0);
		expect(selectFlashcardForStudy([only], () => 0.999)).toBe(only);
	});
	it('never returns the initial card from outside the selected box', () => {
		const first = card('first', 0, 100);
		const selected = card('selected', 4, 1);
		expect(getFlashcardInRandomBox([first, selected], () => 0.999)).toBe(
			selected,
		);
	});
	it('prefers a never-studied card in the selected box', () => {
		const unseen = card('unseen', 0);
		expect(
			getFlashcardInRandomBox([card('seen', 0, 50), unseen], () => 0),
		).toBe(unseen);
	});
	it('prioritizes due cards over optional extra practice', () => {
		const overdue = card('overdue', 4, 15);
		expect(
			selectFlashcardForStudy([card('recent', 0, 0), overdue], () => 0),
		).toBe(overdue);
	});
	it('is due exactly at the interval boundary', () =>
		expect(isDueForStudy(card('boundary', 4, 14))).toBe(true));
	it.each([NaN, Infinity, -1, 5, 1.5])('rejects invalid box %s', box => {
		expect(() => moveToBox(true, box)).toThrow();
		expect(() => isDueForStudy(card('invalid', box))).toThrow();
	});
});
