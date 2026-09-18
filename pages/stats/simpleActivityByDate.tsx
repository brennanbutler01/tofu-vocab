import { Layout } from '@/components/Layout';
import { DaysStudiedInMonthCalendar } from '@/components/stats/DaysStudiedInMonthCalendar';
import Head from 'next/head';
import { useMemo, useState } from 'react';

export default function simpleActivityByDate() {
	const memoDate = useMemo(() => new Date(), []);
	const [month, setMonth] = useState<Date>(memoDate);
	return (
		<div>
			<Head>
				<title>Activity by Date - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout>
				<DaysStudiedInMonthCalendar
					month={month}
					setMonth={setMonth}
				/>
			</Layout>
		</div>
	);
}
