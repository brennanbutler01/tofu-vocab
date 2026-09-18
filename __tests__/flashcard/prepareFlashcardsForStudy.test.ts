import {
	getLatestAttemptDate,
	isDateOverdue,
	isDueForStudy,
} from 'flashcard/prepareFlashcardForStudy';
import dayjs from 'utils/dayjs-with-plugins';

import { flashcardsWithBoxes } from 'mocks/mock-data/flashcard';

describe('prepareFlashcardsForStudy works as intended', () => {
	//checks to see if the date is overdue
	describe('isDateOverdue works properly', () => {
		it('returns true if we are outside the date range specified', () => {
			const dateToCheck = dayjs(dayjs().subtract(15, 'days')).toDate();
			const res = isDateOverdue(dateToCheck, 4, 'days');
			expect(res).toBe(true);
		});

		it('returns false if we are inside the date range specified', () => {
			const dateToCheck = dayjs(dayjs().subtract(5, 'days')).toDate();
			const res = isDateOverdue(dateToCheck, 14, 'days');
			expect(res).toBe(false);
		});
	});

	describe('isDueForStudy works properly', () => {
		it('a card that has not been studied in 3 days returns true if it need sstudied every day', () => {
			const res = isDueForStudy({
				...flashcardsWithBoxes[0],
				attempts: [
					{
						created_at: dayjs().subtract(3, 'days').toDate(),
						flashcardId: '1',
						id: '1',
						isCorrect: true,
						userId: '1',
						updated_at: new Date(),
					},
				],
			});
			expect(res).toBe(true);
		});

		it('a card that has not been studied in 1 hour returns false if it need sstudied every day', () => {
			const res = isDueForStudy(flashcardsWithBoxes[0]);
			expect(res).toBe(false);
		});
	});

	describe('getLatestAttemptDate', () => {
		it('should return null if we have no attempts', () => {
			expect(getLatestAttemptDate([])).toBe(null);
		});

		it('should return the latest attempt if we have multiple', () => {
			const oneHourAgo = dayjs().subtract(1, 'hour').toDate();
			expect(
				getLatestAttemptDate([
					{
						created_at: dayjs().subtract(24, 'days').toDate(),
						flashcardId: '1',
						id: '1',
						isCorrect: true,
						updated_at: new Date(),
						userId: '1',
					},
					{
						created_at: dayjs().subtract(1, 'day').toDate(),
						flashcardId: '1',
						id: '2',
						isCorrect: true,
						updated_at: new Date(),
						userId: '1',
					},
					{
						created_at: oneHourAgo,
						flashcardId: '1',
						id: '3',
						isCorrect: true,
						updated_at: new Date(),
						userId: '1',
					},
				]),
			).toBe(oneHourAgo);
		});

		it('should return the only attempt if we have', () => {
			const oneHourAgo = dayjs().subtract(1, 'hour').toDate();
			expect(
				getLatestAttemptDate([
					{
						created_at: oneHourAgo,
						flashcardId: '1',
						id: '3',
						isCorrect: true,
						updated_at: new Date(),
						userId: '1',
					},
				]),
			).toBe(oneHourAgo);
		});
	});

	describe('isDueForStudy', () => {
		it('should return true if we have no attempts', () => {
			expect(
				isDueForStudy({ ...flashcardsWithBoxes[0], attempts: [] }),
			).toBe(true);
		});

		it('should return true if we are overdue', () => {
			expect(
				isDueForStudy({
					...flashcardsWithBoxes[0],
					attempts: [
						{
							created_at: dayjs().subtract(1, 'year').toDate(),
							flashcardId: '1',
							id: '1',
							isCorrect: true,
							updated_at: new Date(),
							userId: '1',
						},
					],
				}),
			).toBe(true);
		});

		it('should return false if we are not overdue', () => {
			expect(
				isDueForStudy({
					...flashcardsWithBoxes[0],
					attempts: [
						{
							created_at: dayjs().add(1, 'year').toDate(),
							flashcardId: '1',
							id: '1',
							isCorrect: true,
							updated_at: new Date(),
							userId: '1',
						},
					],
				}),
			).toBe(false);
		});
	});
});
