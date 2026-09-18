import { IdQueryErrors, validateIdQuery } from 'utils/validateIdQuery';

describe('validate id query function should properly parse and handle an id', () => {
	it('should return an error if id is undefined', () => {
		const result = validateIdQuery(undefined);
		expect(result).toEqual({
			error: true,
			message: IdQueryErrors.ID_UNDEFINED,
		});
	});

	it('should return an error if id is an array', () => {
		const result = validateIdQuery(['hi']);
		expect(result).toEqual({
			error: true,
			message: IdQueryErrors.ID_IS_ARRAY,
		});
	});

	it('should return without an error if valid', () => {
		const result = validateIdQuery('valid');
		expect(result).toEqual({
			error: false,
			message: 'ok',
		});
	});
});
