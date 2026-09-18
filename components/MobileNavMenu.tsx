import { Menu, Burger, createStyles } from '@mantine/core';
import { Link } from './Layout';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import { AuthButton } from './AuthButton';
import { raleway } from 'pages/_app';
import { useRouter } from 'next/router';

type Props = {
	links: Link[];
	opened: boolean;
	onClick: () => void;
	close: () => void;
};

const styles = createStyles(theme => ({
	authItem: {
		textAlign: 'center',
	},

	link: {
		textDecoration: 'none',

		span: {
			':hover': {
				color: theme.colors.teal[6],
			},
		},
	},

	item: {
		textAlign: 'center',
		fontSize: '14px',
		fontFamily: raleway.style.fontFamily,
		fontWeight: 600,
		textTransform: 'lowercase',
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[1]
				: theme.colors.gray[7],
		transition: '100ms ease-in-out all',
	},

	active: {
		backgroundColor:
			theme.colorScheme === 'dark'
				? theme.colors.dark[5]
				: theme.colors.gray[1],
		color: theme.colors.teal[7],
	},
}));

export function MobileNavMenu({ links, close, ...rest }: Props) {
	const { classes, cx } = styles();
	const session = useSession();
	const { pathname } = useRouter();

	const authorizedItems = links.map(({ href, text }, i) => {
		return (
			<NextLink
				key={href}
				href={href}
				passHref
				className={classes.link}
			>
				<Menu.Item
					className={cx(classes.item, {
						[classes.active]: pathname.includes(href),
					})}
					key={href} //we have this here so we can make sure we don't render a button inside of a button with the auth
				>
					{text}
				</Menu.Item>
				<Menu.Divider />
			</NextLink>
		);
	});
	return (
		<Menu
			shadow="md"
			onClose={close}
			radius="sm"
			withArrow
		>
			<Menu.Target>
				<Burger
					title="burger-menu"
					{...rest}
				/>
			</Menu.Target>

			<Menu.Dropdown>
				{session.status === 'authenticated' && authorizedItems}
				<Menu.Item component="span">
					<AuthButton
						name={session?.data?.user?.name}
						sessionStatus={session.status}
						email={session?.data?.user?.email}
					/>
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
}
