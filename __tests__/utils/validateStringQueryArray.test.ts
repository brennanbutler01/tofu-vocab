import {
	StringQueryErrors,
	validateStringQueryArray,
} from 'utils/validateStringQueryArray';

describe('validateStringQueryArray', () => {
	it('should return an error if we dont have an array', () => {
		const result = validateStringQueryArray('hi');
		expect(result).toEqual({
			error: true,
			message: StringQueryErrors.QUERY_IS_NOT_ARRAY,
		});
	});

	it('should return all good if we have an array', () => {
		const result = validateStringQueryArray(['hi']);
		expect(result).toEqual({ error: false, message: 'ok' });
	});
});
