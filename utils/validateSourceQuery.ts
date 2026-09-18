import { FlashcardSources } from '@prisma/client';

export enum SourceQueryErrors {
	SOURCE_UNDEFINED = 'SOURCE is not defined - please pass a valid source',
	SOURCE_IS_ARRAY = 'source cannot be an array - please pass just a string source',
	SOURCE_INVALID = "Source must be one of : 'ALL', 'BOX4', 'NOT_STUDIED', or 'IN_PROGRESS'",
}

export function validateSourceQuery(source: string | string[] | undefined) {
	const status = {
		error: false,
		message: 'ok',
	};

	if (!source) {
		status.error = true;
		status.message = SourceQueryErrors.SOURCE_UNDEFINED;
	}

	if (Array.isArray(source)) {
		status.error = true;
		status.message = SourceQueryErrors.SOURCE_IS_ARRAY;
	}

	if (!Object.values(FlashcardSources).includes(source as FlashcardSources)) {
		status.error = true;
		status.message = SourceQueryErrors.SOURCE_INVALID;
	}

	return status;
}
