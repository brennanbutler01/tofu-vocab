import type { StudyAttempt } from '@prisma/client';
import dayjs from 'utils/dayjs-with-plugins';
import type { FlashcardWithBox } from './crud/getOne';

export type Boxes = 0 | 1 | 2 | 3 | 4;

//check if date is between now & x amount of days before now
//return false if it is between
export function isDateOverdue(
	date: Date,
	value: number,
	unit: dayjs.ManipulateType,
) {
	//check and see if the this date is outside of the range allowed.
	return !dayjs(date).isAfter(dayjs().subtract(value, unit));
}

//get a random box to look for a card to study, we will study the lower boxes first
export function generateRandomBox() {
	const number = Math.floor(Math.random() * 100) + 1;

	if (number <= 8) {
		return 4;
	}

	if (number <= 14) {
		return 3;
	}

	if (number <= 28) {
		return 2;
	}

	if (number <= 50) {
		return 1;
	}

	return 0;
}

// Weight only populated boxes so selecting an empty box cannot recurse forever.
const boxWeights = [50, 22, 14, 6, 8];

export function getFlashcardInRandomBox(
	flashcards: FlashcardWithBox[],
	random: () => number = Math.random,
): FlashcardWithBox | null {
	if (flashcards.length === 0) return null;
	for (const card of flashcards) {
		if (
			!Number.isInteger(card.box.boxNumber) ||
			card.box.boxNumber < 0 ||
			card.box.boxNumber > 4
		) {
			throw new Error('Box number must be an integer from 0 to 4.');
		}
	}
	const available = boxWeights
		.map((weight, box) => ({
			weight,
			cards: flashcards.filter(card => card.box.boxNumber === box),
		}))
		.filter(group => group.cards.length > 0);
	const sample = random();
	if (!Number.isFinite(sample) || sample < 0 || sample >= 1)
		throw new Error('Random sample must be in [0, 1).');
	let threshold =
		sample * available.reduce((sum, group) => sum + group.weight, 0);
	let selected = available[available.length - 1];
	for (const group of available) {
		threshold -= group.weight;
		if (threshold < 0) {
			selected = group;
			break;
		}
	}
	const lastStudied = (card: FlashcardWithBox) => {
		const date = getLatestAttemptDate(card.attempts);
		return date ? new Date(date).getTime() : Number.NEGATIVE_INFINITY;
	};
	return selected.cards.reduce((oldest, card) =>
		lastStudied(card) < lastStudied(oldest) ? card : oldest,
	);
}

export function selectFlashcardForStudy(
	flashcards: FlashcardWithBox[],
	random: () => number = Math.random,
) {
	const due = flashcards.filter(isDueForStudy);
	return getFlashcardInRandomBox(due.length ? due : flashcards, random);
}

// Review intervals increase as a card progresses through the five boxes.
export const studyTimeframes: Record<
	Boxes,
	{
		value: number;
		unit: dayjs.ManipulateType;
	}
> = {
	0: {
		value: 1,
		unit: 'day',
	},
	1: {
		value: 2,
		unit: 'days',
	},
	2: {
		value: 4,
		unit: 'days',
	},
	3: {
		value: 9,
		unit: 'days',
	},
	4: {
		value: 14,
		unit: 'days',
	},
};

//go through our study attempts and find the one that is the earliest
export const getEarliestAttemptDate = (attempts: StudyAttempt[]) => {
	if (attempts?.length <= 0 || !attempts) return null;

	//go through all the attempts and find the earliest one

	const earliestDate = attempts.reduce((prev, current) => {
		return dayjs(prev.created_at).isBefore(current.created_at)
			? prev
			: current;
	}, attempts[0]);

	return earliestDate.created_at;
};

//go through our study attempts and find the latest one or null if there are none
export const getLatestAttemptDate = (attempts: StudyAttempt[]) => {
	if (attempts?.length <= 0 || !attempts) return null;

	//go through all the attempts and find the latest one
	const latestDate = attempts.reduce((prev, current) => {
		return dayjs(prev.created_at).isAfter(current.created_at)
			? prev
			: current;
	}, attempts[0]);

	return latestDate.created_at;
};

export function isDueForStudy({ box, attempts }: FlashcardWithBox) {
	//go through all the attempts and find the latest one
	const latestDate = getLatestAttemptDate(attempts);

	if (
		!Number.isInteger(box.boxNumber) ||
		box.boxNumber < 0 ||
		box.boxNumber > 4
	)
		throw new Error('Box number must be an integer from 0 to 4.');
	const { value, unit } = Object.values(studyTimeframes)[box.boxNumber];
	return latestDate ? isDateOverdue(latestDate, value, unit) : true;
}
