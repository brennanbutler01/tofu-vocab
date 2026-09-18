import { Layout } from '@/components/Layout';
import Head from 'next/head';
import { useAttemptsPerDaySWR } from 'user/swr';
import {
	ActionIcon,
	Box,
	Flex,
	LoadingOverlay,
	Stack,
	Text,
} from '@mantine/core';
import { AppTitle } from '@/components/AppTitle';
import dayjs from 'dayjs';
import { useState } from 'react';
import CorrectPerDayWaffle from '@/components/stats/CorrectPerDayWaffle';
import userStatsCrud, { ICountPerDay } from 'user/crud/stats';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import ActivityPerDayCalendar from '@/components/stats/ActivityPerDayCalendar';
import ActivityPerDayStream from '@/components/stats/ActivityPerDayStream';
import ActivityPerDayLine from '@/components/stats/ActivityPerDayLine';
import AttemptsPerDayFilter from '@/components/stats/AttemptsPerDayFilter';
import { BsFillPieChartFill } from 'react-icons/bs';
import { IoGrid } from 'react-icons/io5';
import CorrectPerDayPie from '@/components/stats/CorrectPerDayPie';

type Props = { swrStats: ICountPerDay[] };

function attemptsPerDay({ swrStats }: Props) {
	const { attemptsPerDay, isLoading } = useAttemptsPerDaySWR(swrStats);
	const [attempt, setAttempt] = useState<ICountPerDay>();
	const [view, setView] = useState<'calendar' | 'stream' | 'line'>(
		'calendar',
	);
	const [correctIncorrectView, setCorrectIncorrectView] = useState<
		'pie' | 'waffle'
	>('waffle');

	const mainChart = (
		<>
			{attempt ? (
				<Box mt="lg">
					<Text
						color="dimmed"
						size="lg"
					>
						correct/incorrect on {attempt.date}
					</Text>
					<Box h={200}>
						{correctIncorrectView === 'pie' ? (
							<CorrectPerDayPie data={attempt} />
						) : (
							<CorrectPerDayWaffle data={attempt} />
						)}
					</Box>
					<Flex direction={'column'}>
						<ActionIcon
							variant={
								correctIncorrectView === 'pie'
									? 'filled'
									: 'light'
							}
							onClick={() => setCorrectIncorrectView('pie')}
						>
							<BsFillPieChartFill />
						</ActionIcon>
						<ActionIcon
							variant={
								correctIncorrectView === 'waffle'
									? 'filled'
									: 'light'
							}
							onClick={() => setCorrectIncorrectView('waffle')}
						>
							<IoGrid />
						</ActionIcon>
					</Flex>
				</Box>
			) : null}
			{view === 'stream' ? (
				<Box
					h={300}
					sx={{ display: 'flex', alignItems: 'center' }}
				>
					<ActivityPerDayStream />
				</Box>
			) : view === 'line' ? (
				<Box
					h={300}
					sx={{ display: 'flex', alignItems: 'center' }}
				>
					<ActivityPerDayLine
						onClick={point =>
							setAttempt(
								attemptsPerDay?.find(
									d =>
										d.date ===
										dayjs(point.data.xFormatted).format(
											'YYYY-MM-DD',
										),
								),
							)
						}
					/>
				</Box>
			) : attemptsPerDay ? (
				<Box h={300}>
					<ActivityPerDayCalendar
						onClick={day =>
							setAttempt(
								attemptsPerDay?.find(
									d =>
										d.date ===
										dayjs(day.date).format('YYYY-MM-DD'),
								),
							)
						}
					/>
				</Box>
			) : null}
		</>
	);

	return (
		<div>
			<Head>
				<title>Attempts/Day - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout>
				<LoadingOverlay visible={isLoading} />
				<AppTitle text="Study Attempts" />
				<Text
					size="xs"
					color="dimmed"
				>
					Your study attempts since account creation - darker colors
					mean that you studied more!
				</Text>
				<Text
					size="xs"
					color="dimmed"
				>
					Hover or click on a day to get more information.
				</Text>
				<Stack mah={'80vh'}>
					{mainChart}
					<AttemptsPerDayFilter
						filter={view}
						setFilter={(view: 'calendar' | 'stream' | 'line') => {
							setAttempt(undefined);
							setView(view);
						}}
					/>
				</Stack>
			</Layout>
		</div>
	);
}

export default attemptsPerDay;

export async function getServerSideProps({
	req,
	res,
}: GetServerSidePropsContext) {
	const session = await getServerSession(req, res, authOptions);
	if (!session?.user) {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false,
			},
		};
	} else {
		return {
			props: {
				swrStats: await userStatsCrud.getAttemptsPerDay(
					session?.user?.id,
				),
			},
		};
	}
}
