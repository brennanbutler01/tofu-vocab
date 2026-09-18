import { List } from '@mantine/core';

import Link from 'next/link';

type Props = { link: { text: string; href: string } };

export default function StatsAccordionLink({ link }: Props) {
	return (
		<List.Item key={link.text}>
			<Link href={link.href}>{link.text}</Link>
		</List.Item>
	);
}
