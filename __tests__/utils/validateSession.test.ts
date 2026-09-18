import { mockSession } from 'mocks/mock-data/session';
import { validateSession } from 'utils/validateSession';

describe('Validatesession works properly to make sure that we have a valid session', () => {
	it('should have an error if we pass null', () => {
		const res = validateSession(null);
		expect(res).toEqual({ error: true, userId: '' });
	});

	it('should return a user id if we have a valid session', () => {
		const res = validateSession(mockSession);
		expect(res).toEqual({ error: false, userId: '1' });
	});
});

it.each(['', '   '])('rejects an empty user ID', id => {
	expect(
		validateSession({ ...mockSession, user: { ...mockSession.user, id } })
			.error,
	).toBe(true);
});
