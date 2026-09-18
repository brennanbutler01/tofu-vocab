import { StudySides } from '@prisma/client';
import { trimAndLowercase } from 'utils/trimAndLowercase';

//this function is used to grade the answer and see if we are correct
export const checkAnswer = (
	frontAndBack: { front: string[]; back: string[] },
	answer: string[],
	side: StudySides,
) => {
	return frontAndBack[side === 'FRONT' ? 'back' : 'front'].some(val => {
		return answer?.some(a => trimAndLowercase(a) === trimAndLowercase(val));
	});
};
