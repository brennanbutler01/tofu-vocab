import {
	Menu,
	Group,
	createStyles,
	Avatar,
	Text,
	UnstyledButton,
	Stack,
	Skeleton,
	Loader,
} from '@mantine/core';
import { User } from '@prisma/client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { forwardRef } from 'react';
import { BiChevronRight } from 'react-icons/bi';
import { FaSignOutAlt } from 'react-icons/fa';
import { TiUser } from 'react-icons/ti';
import DeleteAccount from './DeleteAccount';
import ToggleColorScheme from './ToggleColorScheme';

const styles = createStyles(theme => ({
	link: {
		a: {
			textDecoration: 'none',
		},
	},
}));

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	image?: string | null;
	userName?: string | null;
	email?: string | null;
	icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
	({ image, userName, email, icon, ...others }: UserButtonProps, ref) => (
		<UnstyledButton
			ref={ref}
			sx={theme => ({
				display: 'block',
				width: '100%',
				padding: theme.spacing.md,
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				color:
					theme.colorScheme === 'dark'
						? theme.colors.dark[0]
						: theme.black,

				'&:hover': {
					backgroundColor:
						theme.colorScheme === 'dark'
							? theme.colors.dark[8]
							: theme.colors.gray[0],
				},
			})}
			{...others}
		>
			<Group
				noWrap
				position="apart"
			>
				<Avatar
					src={image}
					radius="xl"
					alt="User Avatar"
				/>

				<div>
					<Text
						size="sm"
						weight={500}
						maw={140}
						sx={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{userName}
					</Text>

					<Text
						color="dimmed"
						size="xs"
						maw={140}
						sx={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{email}
					</Text>
				</div>
				<BiChevronRight size={16} />
			</Group>
		</UnstyledButton>
	),
);

type Props = {
	user?: User | void;
};

export default function UserMenu({ user }: Props) {
	const { classes } = styles();

	return (
		<Menu
			radius="md"
			shadow={'xl'}
			withArrow
			withinPortal
			offset={25}
			position="right-end"
		>
			<Menu.Target>
				{user ? (
					<UserButton
						image={user?.image}
						userName={user?.name}
						email={user?.email}
					/>
				) : (
					<Group>
						<Text
							size="sm"
							color="dimmed"
						>
							Loading...
						</Text>
						<Loader size="sm" />
					</Group>
				)}
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label>User Actions</Menu.Label>
				<Menu.Divider />
				<ToggleColorScheme />
				<Menu.Divider />
				<Link
					href="/profile"
					className={classes.link}
					passHref
					style={{ textDecoration: 'none' }}
				>
					<Menu.Item
						component="span"
						icon={<TiUser />}
					>
						Profile
					</Menu.Item>
				</Link>
				<Menu.Divider />
				<Menu.Item
					onClick={async () => await signOut()}
					icon={<FaSignOutAlt />}
				>
					Sign Out
				</Menu.Item>
				<Menu.Divider />
				<Menu.Label color="red">Danger!</Menu.Label>
				<Menu.Divider />
				<DeleteAccount />
			</Menu.Dropdown>
		</Menu>
	);
}
