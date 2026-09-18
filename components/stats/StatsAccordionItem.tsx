import { Accordion, ThemeIcon, List } from '@mantine/core';
import { AccordionConfig } from './StatsAccordion';
import StatsAccordionLink from './StatsAccordionLink';

type Props = {
	item: AccordionConfig;
};

export default function StatsAccordionItem({ item }: Props) {
	const links = item.panelItems.map(i => (
		<StatsAccordionLink
			link={i}
			key={i.href}
		/>
	));

	return (
		<Accordion.Item
			value={item.itemKey}
			key={item.itemKey}
		>
			<Accordion.Control
				icon={
					<ThemeIcon color={item.color}>{item.controlIcon}</ThemeIcon>
				}
			>
				{item.controlText}
			</Accordion.Control>
			<Accordion.Panel>
				<List>{links}</List>
			</Accordion.Panel>
		</Accordion.Item>
	);
}
