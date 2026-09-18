import { Http, HttpError } from 'utils/http';

describe('HTTP error propagation', () => {
	it.each(['get', 'post', 'put', 'delete'] as const)(
		'rejects failed %s calls before parsing HTML',
		async method => {
			const http = new Http(
				async () =>
					new Response('Service unavailable', { status: 503 }),
			);
			const calls = {
				get: () => http.get('/example'),
				post: () => http.post('/example', {}),
				put: () => http.put('/example', {}),
				delete: () => http.delete('/example'),
			};
			await expect(calls[method]()).rejects.toEqual(new HttpError(503));
		},
	);
	it('does not turn a forbidden JSON response into saved data', async () => {
		const http = new Http(
			async () => new Response('{"error":"forbidden"}', { status: 403 }),
		);
		await expect(http.put('/example', {})).rejects.toEqual(
			new HttpError(403),
		);
	});
	it('preserves network failures for the caller', async () => {
		const failure = new Error('Offline');
		const http = new Http(async () => {
			throw failure;
		});
		await expect(http.get('/example')).rejects.toBe(failure);
	});
	it('sends the intended body and returns saved data', async () => {
		const requests: RequestInit[] = [];
		const http = new Http(async (_url, init) => {
			requests.push(init || {});
			return new Response('{"id":"saved"}', { status: 201 });
		});
		await expect(
			http.post('/example', { front: ['xin chào'] }),
		).resolves.toEqual({ id: 'saved' });
		expect(requests[0].body).toBe(JSON.stringify({ front: ['xin chào'] }));
		expect(requests[0].method).toBe('POST');
	});
});
