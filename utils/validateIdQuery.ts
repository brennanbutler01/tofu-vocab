export enum IdQueryErrors {
	ID_UNDEFINED = 'id is not defined - please pass a string id',
	ID_IS_ARRAY = 'id cannot be an array - please pass just a string id',
}

//this function is used  to validate our query params for dynamic routes
export function validateIdQuery(id: string | string[] | undefined) {
	const status = {
		error: false,
		message: 'ok',
	};

	if (!id) {
		status.error = true;
		status.message = IdQueryErrors.ID_UNDEFINED;
	}

	if (Array.isArray(id)) {
		status.error = true;
		status.message = IdQueryErrors.ID_IS_ARRAY;
	}

	return status;
}
