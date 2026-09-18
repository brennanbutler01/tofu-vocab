//this function makes sure that the server side session is valid

import { Session } from 'next-auth';

export function validateSession(session: Session | null) {
	if (
		typeof session?.user?.id === 'string' &&
		session.user.id.trim().length > 0
	) {
		return { error: false, userId: session?.user?.id };
	} else {
		return { error: true, userId: '' };
	}
}
