import { Anchor, createStyles, Navbar, ThemeIcon } from '@mantine/core';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Link } from './Layout';
import UserButton from './UserButton';

const styles = createStyles(theme => ({
	navbar: {
		backgroundColor: theme.fn.lighten(
			theme.colorScheme === 'dark'
				? theme.colors.dark[8]
				: theme.colors.gray[0],
			0.02,
		),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		overflowY: 'scroll',
	},
	linksContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing.sm,

		borderRadius: theme.radius.md,
	},
	link: {
		display: 'flex',
		justifyContent: 'start',
		gap: theme.spacing.sm,
		alignItems: 'center',
		textDecoration: 'none',
		padding: theme.spacing.sm,
		marginLeft: theme.spacing.sm,
		borderRadius: theme.radius.sm,
		':hover': {
			backgroundColor: theme.fn.lighten(
				theme.colorScheme === 'dark'
					? theme.colors.dark[7]
					: theme.colors.gray[1],
				0.0125,
			),
			span: {
				color: theme.colorScheme === 'dark' ? theme.white : theme.black,
			},
		},

		span: {
			fontFamily: theme.headings.fontFamily,
			fontSize: theme.fontSizes.sm,
			marginLeft: theme.spacing.md,
			letterSpacing: 1,
			fontWeight: 500,
			color:
				theme.colorScheme === 'dark'
					? theme.colors.dark[1]
					: theme.black,
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			':hover': {
				textDecoration: 'none',
			},
		},
	},
	activeLink: {
		backgroundColor:
			theme.colorScheme === 'dark'
				? theme.colors.dark[6]
				: theme.colors.gray[2],
		':hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.colors.dark[5]
					: theme.colors.gray[1],
		},
	},
	icon: {
		borderRadius: theme.radius.sm,
	},
	footer: {
		borderTop: `1px solid ${
			theme.colorScheme === 'dark'
				? theme.colors.dark[5]
				: theme.colors.gray[2]
		}`,
		marginTop: theme.spacing.lg,
		// padding: theme.spacing.xl,
		boxShadow: theme.shadows.xs,
		backgroundColor:
			theme.colorScheme === 'dark'
				? theme.colors.dark[7]
				: theme.colors.gray[0],
	},
	auth: {
		cursor: 'pointer',
		padding: theme.spacing.sm,
		borderRadius: theme.radius.md,
		boxShadow: theme.shadows.md,
		':hover': {
			backgroundColor: theme.colors.dark[6],
			boxShadow: theme.shadows.xl,
		},
	},
	authText: {
		fontSize: theme.fontSizes.xl,
		fontFamily: theme.headings.fontFamily,
		fontWeight: 500,
	},
}));

type Props = { links: Link[] };

export function AppNavbar({ links }: Props) {
	const { classes, cx } = styles();
	const { pathname } = useRouter();
	const session = useSession();

	const linkArr = links.map(({ text, href, icon }) => (
		<NextLink
			href={href}
			className={cx(classes.link, {
				[classes.activeLink]: pathname == href,
			})}
			key={href}
		>
			<ThemeIcon
				className={classes.icon}
				variant="light"
			>
				{icon}
			</ThemeIcon>
			<Anchor component="span">{text}</Anchor>
		</NextLink>
	));

	return (
		<Navbar
			p="lg"
			withBorder
			width={{ md: 300 }}
			hidden
			hiddenBreakpoint={'md'}
			className={classes.navbar}
		>
			<div className={classes.linksContainer}>
				{session.status === 'authenticated' && linkArr}
			</div>
			<div className={classes.footer}>
				<UserButton />
			</div>
		</Navbar>
	);
}
