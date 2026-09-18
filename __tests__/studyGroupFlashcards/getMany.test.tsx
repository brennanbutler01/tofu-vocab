import { mockStudyGroupFlashcard } from 'mocks/mock-data/studyGroupFlashcards';
import { prismaMock } from 'setupTests';
import getManyStudyGroupFlashcards from 'studyGroupFlashcards/crud/getMany';

describe('getMany study group flashcards', () => {
	it('should make api requests', () => {
		const res = getManyStudyGroupFlashcards.apiGetStudyGroupFlashcards();
		expect(res).resolves.toEqual([mockStudyGroupFlashcard]);
	});
	it('should make db requests', () => {
		prismaMock.groupFlashcard.findMany.mockResolvedValue([
			mockStudyGroupFlashcard,
		]);
		expect(
			getManyStudyGroupFlashcards.dbGetStudyGroupFlashcards('1'),
		).resolves.toEqual([mockStudyGroupFlashcard]);
	});
});
