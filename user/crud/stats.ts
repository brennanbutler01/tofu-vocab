import http from 'utils/http';
import prisma from 'prisma/db/index';
import dayjs from 'utils/dayjs-with-plugins';
import getUserTimezone from 'utils/getUserTimezone';

export interface UserStatsSum {
	times_seen: number;
	correct: number;
	incorrect: number;
}

type Count = { _count: number };

export type UserStats = {
	cardsInBoxFour: Count;
	cardsInProgress: Count;
	cardsNotYetStudied: Count;
	accountAge: string;
};

export interface IDaysInMonth {
	date: string;
	count: number;
}

export type StatsReturn = [
	UserStats['cardsInBoxFour'],
	UserStats['cardsInProgress'],
	UserStats['cardsNotYetStudied'],
	UserStats['accountAge'],
];

export interface ICountPerDay {
	date: string;
	correct: number;
	incorrect: number;
	total: number;
}

export interface ICountPerBox {
	count: number;
	boxNumber: number;
}

export class UserStatsCRUD {
	API_ENDPOINT = '/api/stats/';
	COMPLEX_ENDPOINT = '/api/stats/complex/';

	getStatsFromApi = async () => {
		return await http.get<UserStats>(this.API_ENDPOINT);
	};

	cardsNotYetStudied = async (userId: string) =>
		await prisma?.flashcard?.aggregate({
			where: {
				AND: [
					{
						attempts: {
							none: {
								userId,
							},
						},
					},
					{ userId },
				],
			},
			_count: true,
		});

	cardsInBoxFour = async (userId: string) =>
		await prisma?.flashcard?.aggregate({
			where: {
				AND: [{ userId }, { box: { boxNumber: 4 } }],
			},
			_count: true,
		});

	cardsInProgress = async (userId: string) =>
		await prisma?.flashcard?.aggregate({
			where: {
				AND: [
					{ userId },
					{ attempts: { some: { userId } } },
					{ box: { boxNumber: { lt: 4 } } },
				],
			},
			_count: true,
		});

	accountAge = async (userId: string) => {
		const user = await prisma?.user?.findUnique({
			where: { id: userId },
			select: { created_at: true },
		});
		return dayjs(user?.created_at).fromNow(true);
	};

	//get the number of days that we studied for a particular month
	getDaysInMonth = async (userId: string, date: Date) => {
		const daysInMonth = dayjs(date).daysInMonth();
		const month = dayjs(date).format('MM');
		const year = date.getFullYear();
		let daysToUse = daysInMonth.toString();
		const endOfMonth = `${month}/${daysInMonth}/${year}`;

		//we need to check if the date is past today because postegre will get mad
		if (dayjs(endOfMonth).isAfter(new Date())) {
			//if it is bigger, we will use this date as our end
			daysToUse = dayjs().date().toString();
		}

		//start of the month
		const start = `${month}/01/${year}`;
		//end of the month or today
		const end = dayjs(`${month}/${daysToUse}/${year}`)
			.add(1, 'day')
			.format('MM/DD/YYYY');

		/* 
		we need to use raw query to be able to generate the series
		we will use the generate_series function to generate 
		a series of dates, one for each day, from the start date 
		to the end date
		we then check each date to see if we have a study attempt for that day 
		for this user
		if we do have a study attempt, we will count 
		it as a day studied and make it 1 
		*/

		const zone = await getUserTimezone(userId);

		return await prisma?.$queryRawUnsafe<IDaysInMonth[]>(
			`SELECT
			TO_CHAR(date AT TIME ZONE '${zone}', 'MM/DD/YYYY') AS date,
		 	COUNT(DISTINCT "userId")
 	 		FILTER (WHERE "userId" = '${userId}')::INT
			FROM GENERATE_SERIES('${start}'::TIMESTAMP,
			'${end}'::TIMESTAMP,'1 day') date
			FULL JOIN "StudyAttempt" ON
			TO_CHAR(date AT TIME ZONE '${zone}', 'MM/DD/YYYY') = 
			TO_CHAR(created_at AT TIME ZONE '${zone}', 'MM/DD/YYYY')
			GROUP BY date;`,
		);
	};

	apiGetDaysInMonth = async (date: Date) =>
		await http.get<IDaysInMonth[]>(
			this.COMPLEX_ENDPOINT + date.toISOString(),
		);

	getStats = async (userId: string): Promise<UserStats> =>
		await Promise.all([
			this.cardsInBoxFour(userId),
			this.cardsInProgress(userId),
			this.cardsNotYetStudied(userId),
			this.accountAge(userId),
		]).then((res: StatsReturn) => ({
			cardsInBoxFour: res[0],
			cardsInProgress: res[1],
			cardsNotYetStudied: res[2],
			accountAge: res[3],
		}));

	apiGetAttemptsPerDay = async () =>
		await http.get<ICountPerDay[]>(
			this.COMPLEX_ENDPOINT + '/attemptsPerDay',
		);

	//get the number of correct, incorrect, all attempts by date
	getAttemptsPerDay = async (userId: string) => {
		const zone = await getUserTimezone(userId);

		return await prisma?.$queryRawUnsafe<ICountPerDay[]>(`
		SELECT
		TO_CHAR(created_at AT TIME ZONE '${zone}', 'YYYY-MM-DD') AS date,
		count(1) filter (where "isCorrect" is true)::INT correct,
		count(1) filter (where "isCorrect" is false)::INT incorrect,
		count(*)::INT total
		FROM "StudyAttempt"
		WHERE "userId" = '${userId}'
		GROUP BY date;
		`);
	};

	//cards per box
	getCardsPerBox = async (userId: string) => {
		return await prisma?.$queryRawUnsafe<ICountPerBox[]>(`
		SELECT
		"boxNumber",
		count(DISTINCT "Flashcard"."id")::INT
		FROM "LeitnerBox"
		left JOIN "Flashcard" ON "Flashcard"."boxId" = "LeitnerBox"."id"
		WHERE "LeitnerBox"."userId" = '${userId}'
		GROUP BY "boxNumber";
		`);
	};

	apiGetCardsPerBox = async () =>
		await http.get<ICountPerBox[]>('/api/stats/complex/cardsPerBox');
}
const userStatsCrud = new UserStatsCRUD();
export default userStatsCrud;
