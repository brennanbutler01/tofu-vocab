export enum StringQueryErrors {
	QUERY_UNDEFINED = 'query is undefined - pleaes pass a string array',
	QUERY_IS_NOT_ARRAY = 'query must be a string array ',
	ARRAY_IS_NOT_STRING = 'array must be a string array',
}

//check to make sure that we have a string array as our query params
export function validateStringQueryArray(query: string | string[] | undefined) {
	const status = {
		error: false,
		message: 'ok',
	};

	if (!query) {
		status.error = true;
		status.message = StringQueryErrors.QUERY_UNDEFINED;
	}

	if (!Array.isArray(query)) {
		status.error = true;
		status.message = StringQueryErrors.QUERY_IS_NOT_ARRAY;
	}

	if (Array.isArray(query) && typeof query[0] !== 'string') {
		status.error = true;
		status.message = StringQueryErrors.ARRAY_IS_NOT_STRING;
	}

	return status;
}
