import { http, HttpResponse } from 'msw';
import { flashcardData, flashcardsWithBoxes } from './mock-data/flashcard';
import { mockUsers } from './mock-data/user';
import { boxes } from './mock-data/boxes';
import { mockSession } from './mock-data/session';
import { mockGroup, mockGroups } from './mock-data/group';
import { mockStudyGroupFlashcard } from './mock-data/studyGroupFlashcards';
async function objectBody(request: Request) {
	const value: unknown = await request.json();
	if (!value || typeof value !== 'object' || Array.isArray(value))
		throw new Error('Expected object body');
	return value;
}
export const handlers = [
	http.get('/api/flashcards/ALL', () => HttpResponse.json(flashcardData)),
	http.post('/api/flashcards/ALL', async ({ request }) =>
		HttpResponse.json(await objectBody(request)),
	),
	http.delete('/api/flashcard/:id', ({ params }) =>
		HttpResponse.json({ ...flashcardData[0], id: params.id }),
	),
	http.get('/api/flashcard/study', () =>
		HttpResponse.json(flashcardsWithBoxes.find(card => card.id === '1')),
	),
	http.get('/api/flashcard/:id', ({ params }) => {
		const card = flashcardData.find(card => card.id === params.id);
		return card
			? HttpResponse.json(card)
			: HttpResponse.json(
					{ err: 'Flashcard not found.' },
					{ status: 404 },
				);
	}),
	http.put('/api/flashcard/:id', async ({ params, request }) =>
		HttpResponse.json({
			...flashcardData[0],
			...(await objectBody(request)),
			id: params.id,
		}),
	),
	http.get('/api/user/:id', () => HttpResponse.json(mockUsers[0])),
	http.put('/api/user/:id', async ({ params, request }) =>
		HttpResponse.json({
			...mockUsers.find(user => user.id === params.id),
			...(await objectBody(request)),
		}),
	),
	http.post('/api/boxes/init', () => HttpResponse.json(boxes)),
	http.get('/api/boxes', () => HttpResponse.json(boxes)),
	http.post('/api/boxes', () => HttpResponse.json(boxes[0])),
	http.get('/api/auth/session', () => HttpResponse.json(mockSession)),
	http.post('/api/studyGroups', () => HttpResponse.json(mockGroup)),
	http.get('/api/studyGroups', () => HttpResponse.json(mockGroups)),
	http.put('/api/studyGroup/:id', async ({ params, request }) =>
		HttpResponse.json({
			...mockGroups.find(group => group.id === params.id),
			...(await objectBody(request)),
		}),
	),
	http.get('/api/studyGroupFlashcards', () =>
		HttpResponse.json([mockStudyGroupFlashcard]),
	),
	http.delete('/api/studyGroup/:id', ({ params }) =>
		HttpResponse.json(mockGroups.find(group => group.id === params.id)),
	),
];
