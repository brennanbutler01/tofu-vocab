import { Prisma, User } from '@prisma/client';
import http from 'utils/http';
import { UserCrud } from '.';
import prisma from 'prisma/db/index';
import { SWRMutationResponse } from 'swr/mutation';

interface IUpdateStreak {
	user: User;
	isCorrect: boolean;
	trigger: SWRMutationResponse<
		User,
		Error,
		string,
		Prisma.UserUpdateInput
	>['trigger'];
}

class UpdateUser extends UserCrud {
	constructor() {
		super();
	}

	//send the user update to the api
	apiUpdateUser = async (
		userId: string,
		updateUser: Prisma.UserUpdateInput,
	) =>
		await http.put<User, Prisma.UserUpdateInput>(
			this.SINGULAR_API_ENDPOINT + userId,
			updateUser,
		);

	//update the prisma user
	dbUpdateUser = async (userId: string, updateUser: Prisma.UserUpdateInput) =>
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: updateUser,
		});

	//parse user and response and return our new streak
	parseStreak = (user: User, isCorrect: boolean) => {
		let newBest = user.bestStreak;
		let newCurrent = user.currentStreak;

		//if we are correct
		if (isCorrect) {
			if (newCurrent < 0) {
				newCurrent = 1;
			} else {
				//if we are currently on our best
				if (newBest === newCurrent) {
					//we need to increase our best
					newBest++;
				}
				//we will always increase our current if correct
				newCurrent++;
			}
		} else {
			//if we are wrong, we should reset current
			if (newCurrent > 0) {
				//if we are positive in our current streak, we should change it to negative
				newCurrent = -1;
			} else {
				//if we are already negative, decrement
				newCurrent--;
			}
		}
		return { newBest, newCurrent };
	};

	//update our users streak in response to a flashcard answer - update api and the local cache
	updateStreak = async ({ user, isCorrect, trigger }: IUpdateStreak) => {
		const { newBest, newCurrent } = this.parseStreak(user, isCorrect);

		console.log('this is our new current', newCurrent);
		console.log('this is our new best streak', newBest);
		//update our user
		await trigger(
			{
				bestStreak: newBest,
				currentStreak: newCurrent,
			} as Prisma.UserUpdateInput,
			{
				optimisticData: current => {
					return {
						...current,
						bestStreak: newBest,
						currentStreak: newCurrent,
					} as User;
				},
			},
		);
	};
}

const updateUser = new UpdateUser();
export default updateUser;
