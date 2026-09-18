import { HttpMethods, validateHttpMethod } from 'utils/validateHttpMethod';

describe('validate http method should make sure that we can only make http requests that are permitted', () => {
	it('should return an error & message if the api does not allow the request method', () => {
		const result = validateHttpMethod(
			HttpMethods.CONNECT,
			[HttpMethods.GET, HttpMethods.POST],
			'/api/flashcards',
		);
		expect(result.error).toBe(true);
		expect(result.message).toContain(HttpMethods.CONNECT);
	});

	it('should return ok if we make an allowed request', () => {
		const result = validateHttpMethod(
			HttpMethods.GET,
			[HttpMethods.GET],
			'/api/flashcards',
		);
		expect(result.error).toBe(false);
		expect(result.message).toBe('ok');
	});
});
