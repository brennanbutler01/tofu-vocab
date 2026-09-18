import {
	AppShell,
	Card,
	Container,
	Group,
	rem,
	Text,
	Title,
} from '@mantine/core';
import createManyBoxes from 'boxes/crud/createMany';
import getManyBoxes from 'boxes/crud/getMany';
import { useBoxesSWR } from 'boxes/swr';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { IoMdDocument } from 'react-icons/io';
import updateUser from 'user/crud/update';
import { IoReaderOutline, IoStatsChart } from 'react-icons/io5';
import { AppNavbar } from './AppNavbar';
import { AuthButton } from './AuthButton';
import { TvHeader } from './TvHeader';
import { MdGroup } from 'react-icons/md';
import { useRouter } from 'next/router';

type Props = {
	children: React.ReactNode;
	isProtected?: boolean;
};

export const links = [
	{
		href: '/flashcards',
		text: 'Flashcards',
		icon: <IoMdDocument />,
	},
	{ href: '/study', text: 'Study', icon: <FaGraduationCap /> },
	{ href: '/words', text: 'Discover words', icon: <IoReaderOutline /> },
	{ href: '/studyGroups', text: 'Study groups', icon: <MdGroup /> },
	{ href: '/stats', text: 'Stats', icon: <IoStatsChart /> },
];

export type Link = { href: string; text: string; icon: JSX.Element };

export function Layout({ children, isProtected = true }: Props) {
	const { data: session, status } = useSession();
	const { boxes, isLoading } = useBoxesSWR();
	const router = useRouter();
	const timeZone = useMemo(
		() => Intl.DateTimeFormat().resolvedOptions().timeZone,
		[],
	);

	useEffect(() => {
		const createMany = async () => {
			const boxes = await getManyBoxes.apiGetManyBoxes();
			if (boxes?.length === 5) return;

			await createManyBoxes
				.apiCreateManyBoxes(
					createManyBoxes.initBoxes(session?.user?.id as string),
				)
				.catch(err => console.log('layout 42 -', err));
		};

		const setTimezone = async () => {
			try {
				await updateUser.apiUpdateUser(session?.user?.id as string, {
					timeZone,
				});
			} catch (err) {
				console.log(err);
			}
		};

		if (status === 'authenticated') {
			console.log('boxes', boxes);
			if (boxes?.length !== 5) createMany();
		}
		if (session?.user?.timeZone !== timeZone) {
			setTimezone();
		}
	}, [boxes, isLoading, session, timeZone]);

	if (session || !isProtected) {
		return (
			<AppShell
				navbarOffsetBreakpoint={'md'}
				padding={'md'}
				header={<TvHeader links={links} />}
				navbar={<AppNavbar links={links} />}
			>
				<Container maw={rem(1400)}>{children}</Container>
			</AppShell>
		);
	}

	return (
		<Group
			h={'100vh'}
			w={'100vw'}
		>
			<Container>
				<Card
					p="lg"
					withBorder
					radius="md"
					shadow="lg"
					sx={{ minWidth: '280px', maxWidth: '480px' }}
				>
					<Title
						fw={400}
						align="center"
					>
						Protected page
					</Title>
					<Text
						size="lg"
						color="dimmed"
						p="xl"
						mt="sm"
					>
						You must be signed inafsdf to view this page. The data
						here is personalized for your own studies, so please
						create an account and improve your Vietnamese today!
					</Text>
					<Group
						position="center"
						w={'100%'}
					>
						<AuthButton
							sessionStatus={status}
							email={null}
							size="lg"
							color="teal"
							variant="light"
							radius="md"
						/>
					</Group>
				</Card>
			</Container>
		</Group>
	);
}
