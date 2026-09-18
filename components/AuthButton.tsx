import { Avatar, Button, ButtonProps, Group, Stack, Text } from '@mantine/core';
import { SessionContextValue, signIn, signOut } from 'next-auth/react';
import React from 'react';
import { BiLoaderCircle, BiLogIn, BiLogOut } from 'react-icons/bi';
import { useUserSWR } from 'user/swr';

const config = {
	loading: {
		text: 'loading',
		handleClick: () => console.log('loading'),
		icon: <BiLoaderCircle size={24} />,
		color: 'orange',
	},
	authenticated: {
		handleClick: () => signOut(),
		text: 'Sign Out',
		icon: <BiLogOut size={24} />,
		color: 'red',
	},
	unauthenticated: {
		handleClick: () => signIn(),
		text: 'Sign In',
		icon: <BiLogIn size={24} />,
		color: 'teal',
	},
};

type Props = {
	sessionStatus: SessionContextValue['status'];
	email?: string | null;
	name?: string | null;
	wrapperType?: 'button' | 'navItem';
};

export function AuthButton({
	sessionStatus,
	email,
	name,
	wrapperType = 'button',
	...rest
}: Props & ButtonProps) {
	const { user } = useUserSWR({});
	return (
		<Stack>
			{email && name && (
				<Group noWrap>
					<Avatar
						src={user?.image}
						size="sm"
						radius="xl"
					/>
					<Text
						color="dimmed"
						size={'sm'}
						sx={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{name || email}
					</Text>
				</Group>
			)}
			<Button
				loading={sessionStatus === 'loading'}
				onClick={config[sessionStatus]?.handleClick}
				variant="light"
				{...rest}
			>
				{config[sessionStatus].text}
			</Button>
		</Stack>
	);
}
