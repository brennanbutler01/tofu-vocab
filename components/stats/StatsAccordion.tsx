import { Accordion } from '@mantine/core';
import { BiBox } from 'react-icons/bi';
import { IoCalendar } from 'react-icons/io5';
import StatsAccordionItem from './StatsAccordionItem';

export type AccordionConfig = {
	itemKey: string;
	color: string;
	controlText: string;
	controlIcon: React.ReactNode;
	panelItems: {
		text: string;
		href: string;
	}[];
};

const config: Record<'activity' | 'boxes', AccordionConfig> = {
	activity: {
		itemKey: 'activity',
		color: 'orange',
		controlText: 'study calendars',
		controlIcon: <IoCalendar />,
		panelItems: [
			{
				text: 'simple recap',
				href: '/stats/simpleActivityByDate',
			},
			{
				text: 'detailed view',
				href: '/stats/attemptsPerDay',
			},
		],
	},
	boxes: {
		itemKey: 'boxes',
		color: 'pink',
		controlText: 'study boxes',
		controlIcon: <BiBox />,
		panelItems: [
			{
				text: 'cards by box',
				href: '/stats/cardsPerBox',
			},
		],
	},
};

export default function StatsAccordion() {
	return (
		<Accordion
			multiple
			variant="contained"
			radius="md"
		>
			{Object.values(config).map(i => (
				<StatsAccordionItem
					key={i.color}
					item={i}
				/>
			))}
		</Accordion>
	);
}
