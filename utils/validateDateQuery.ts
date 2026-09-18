import dayjs from 'dayjs';

export enum DateQueryErrors {
	DATE_UNDEFINED = 'DATE is not defined - please pass a string DATE',
	DATE_IS_ARRAY = 'DATE cannot be an array - please pass just a string DATE',
	DATE_IS_INVALID = 'DATE IS INVALID - PLEASE PASS A VALID DATE (ISO, UTC, ETC)',
}

//this function is used  to validate our query params for dynamic routes
export function validateDateQuery(date: string | string[] | undefined) {
	const status = {
		error: false,
		message: 'ok',
		date: date as string,
	};

	if (!date) {
		status.error = true;
		status.message = DateQueryErrors.DATE_UNDEFINED;
	}

	if (Array.isArray(date)) {
		status.error = true;
		status.message = DateQueryErrors.DATE_IS_ARRAY;
	}

	if (!dayjs(date as string).isValid()) {
		status.error = true;
		status.message = DateQueryErrors.DATE_IS_INVALID;
	}

	return status;
}
