import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import getUser from './crud/getOne';
import userStatsCrud, {
	ICountPerBox,
	ICountPerDay,
	UserStats,
} from './crud/stats';

export function useStatsSWR(fallbackData?: UserStats) {
	const { data, error, isLoading } = useSWR(
		'/api/stats/',
		userStatsCrud.getStatsFromApi,
		{ fallbackData },
	);
	return {
		userStats: data,
		isLoading,
		isError: error,
	};
}

export function useAttemptsPerDaySWR(fallbackData?: ICountPerDay[]) {
	const { data, error, isLoading } = useSWR(
		'/api/stats/complex/attemptsPerDay',
		userStatsCrud.apiGetAttemptsPerDay,
		{ fallbackData },
	);

	return {
		attemptsPerDay: data,
		isLoading,
		isError: error,
	};
}

export function useAttemptsPerMonthSWR(date: Date) {
	const { data, error, isLoading } = useSWR(
		'/api/stats/complex/' + date.toISOString(),
		async () => await userStatsCrud.apiGetDaysInMonth(date),
	);

	return {
		attemptsPerMonth: data,
		isLoading,
		isError: error,
	};
}

export function useCardsPerBoxSWR(fallbackData?: ICountPerBox[]) {
	const { data, error, isLoading } = useSWR(
		'/api/stats/complex/cardsPerBox',
		userStatsCrud.apiGetCardsPerBox,
	);
	return {
		cardsPerBox: data,
		isLoading,
		isError: error,
	};
}

interface Props {
	fallbackData?: User;
}

export function useUserSWR({ fallbackData }: Props) {
	const session = useSession();
	const { data, error, isLoading, isValidating } = useSWR(
		'/api/user/' + session?.data?.user?.id,
		async () => await getUser.apiGetUser(session?.data?.user?.id as string),
		{ fallbackData },
	);
	return {
		user: data,
		isLoading: isLoading || isValidating,
		isError: error,
	};
}
