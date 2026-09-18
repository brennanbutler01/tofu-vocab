import { createStyles, Group, Header, rem, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import { useEffect } from 'react';
import { Link as LinkType } from './Layout';
import { MobileNavMenu } from './MobileNavMenu';
import { useSession } from 'next-auth/react';

const styles = createStyles(theme => ({
	header: {
		backgroundColor: theme.fn.lighten(
			theme.colorScheme === 'dark'
				? theme.colors.dark[8]
				: theme.colors.gray[0],
			0.01,
		),
	},

	nav: {
		alignItems: 'center',
		height: '100%',
		display: 'flex',
		justifyContent: 'space-between',
	},

	title: {
		fontFamily: theme.headings.fontFamily,
		// fontFamily: mansalva.style.fontFamily,
		fontWeight: 900,
		fontSize: rem(24),
		textDecoration: 'none',
		color:
			theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[7],
		span: {
			textDecoration: 'none',
		},
	},
}));

type Props = {
	links: LinkType[];
};

export function TvHeader({ links }: Props) {
	const { classes, theme } = styles();
	const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
	const [opened, { toggle, close }] = useDisclosure(false);
	const session = useSession();
	useEffect(() => {
		close();
	}, [isMd]);

	return (
		<Header
			height={70}
			px="lg"
			className={classes.header}
		>
			<nav className={classes.nav}>
				<Group
					position="apart"
					align={'center'}
					w={'100%'}
				>
					<Link
						passHref
						href={'/'}
						style={{
							textDecoration: 'none',
							textDecorationColor: 'unset',
						}}
					>
						<Text className={classes.title}>tofu.vocab</Text>
					</Link>
					{isMd ? (
						<MobileNavMenu
							opened={opened}
							onClick={toggle}
							links={links}
							close={close}
						/>
					) : null}
				</Group>
			</nav>
		</Header>
	);
}
