import { createStyles, Grid, Indicator } from '@mantine/core';
import { Calendar, DayOfWeek } from '@mantine/dates';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useAttemptsPerMonthSWR } from 'user/swr';
import { AppTitle } from '../AppTitle';
import CalendarLegend from './CalendarLegend';

type Props = {
	month: Date;
	setMonth: React.Dispatch<React.SetStateAction<Date>>;
};

const styles = createStyles(() => ({
	outside: {
		opacity: 0,
	},
}));

export function DaysStudiedInMonthCalendar({ month, setMonth }: Props) {
	const [value, setValue] = useState<Date | null>(null);
	const session = useSession();
	const { attemptsPerMonth } = useAttemptsPerMonthSWR(month);
	const { classes, cx } = styles();

	return (
		<div>
			<AppTitle
				fw={300}
				text="Your study activity by day"
			/>
			<Grid
				justify={'space-between'}
				p="lg"
				mt="lg"
			>
				<Grid.Col
					span={12}
					md={3}
				>
					<CalendarLegend />
				</Grid.Col>
				<Grid.Col
					span={12}
					md={8}
				>
					<Calendar
						//@ts-ignore
						fullWidth
						value={value}
						onChange={setValue}
						month={month}
						onMonthChange={setMonth}
						amountOfMonths={1}
						minDate={dayjs(
							session?.data?.user?.created_at,
						).toDate()}
						maxDate={dayjs().toDate()}
						hideOutsideDates={true}
						disableOutsideEvents={true}
						dayClassName={(date: Date, modifiers: any) =>
							cx({ [classes.outside]: modifiers.outside })
						}
						weekendDays={[-1, 8] as unknown as DayOfWeek[]}
						renderDay={date => {
							const day = date.getDate();

							//get the count for this day
							const countForDate = attemptsPerMonth?.find(
								d => new Date(d.date).getDate() === day,
							)?.count;

							return (
								<Indicator
									size={12}
									color={
										countForDate === 0
											? dayjs(date).isSame(dayjs(), 'day')
												? 'yellow'
												: 'red'
											: 'teal'
									}
									offset={8}
									disabled={
										dayjs(date).isBefore(
											dayjs(
												session?.data?.user?.created_at,
											),
											'day',
										) || dayjs(date).isAfter(dayjs())
									}
								>
									<div>{day}</div>
								</Indicator>
							);
						}}
						styles={theme => ({
							cell: {
								border: `1px solid ${
									theme.colorScheme === 'dark'
										? theme.colors.dark[4]
										: theme.colors.gray[2]
								}`,
							},
							day: {
								borderRadius: 0,
								height: 70,
								fontSize: theme.fontSizes.lg,
							},
							weekday: { fontSize: theme.fontSizes.lg },
							weekdayCell: {
								fontSize: theme.fontSizes.xl,
								backgroundColor:
									theme.colorScheme === 'dark'
										? theme.colors.dark[5]
										: theme.colors.gray[0],
								border: `1px solid ${
									theme.colorScheme === 'dark'
										? theme.colors.dark[4]
										: theme.colors.gray[2]
								}`,
								height: 70,
							},
						})}
					/>
				</Grid.Col>
			</Grid>
		</div>
	);
}
