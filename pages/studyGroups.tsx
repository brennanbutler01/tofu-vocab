import { AppTitle } from '@/components/AppTitle';
import CreateGroupButton from '@/components/groups/CreateGroupButton';
import GroupGrid from '@/components/groups/GroupGrid';
import GroupSearch from '@/components/groups/GroupSearch';
import StudyGroupEmpty from '@/components/groups/StudyGroupEmpty';
import { Layout } from '@/components/Layout';
import {
	Group,
	LoadingOverlay,
	SegmentedControl,
	Stack,
	Text,
} from '@mantine/core';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useMemo, useState } from 'react';
import getManyStudyGroups from 'studyGroups/crud/getMany';
import searchStudyGroups from 'studyGroups/searchStudyGroups';
import { useStudyGroupSWR } from 'studyGroups/swr';
import { transformMockedData } from 'utils/transformMockedData';
import { authOptions } from './api/auth/[...nextauth]';
import { useInvitationSWR } from '../invitations/swr';
import PendingInvites from '@/components/invitation/pendingInvites';

type SegementedValues = 'all' | 'yours' | 'public';

function StudyGroupPage() {
	const { data: studyGroups, isLoading } = useStudyGroupSWR();
	const [search, setSearch] = useState<string>('');
	const [filter, setFilter] = useState<SegementedValues>('all');
	const session = useSession();
	const { data: invitations } = useInvitationSWR();

	const filteredStudyGroups = useMemo(
		() =>
			getManyStudyGroups.filterStudyGroups(
				filter,
				searchStudyGroups(search, studyGroups || []),
				session?.data?.user?.id as string,
			),
		[search, studyGroups, filter],
	);

	return (
		<div>
			<Head>
				<title>Groups - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout isProtected={false}>
				<Stack>
					<Group position="apart">
						<Stack spacing={'lg'}>
							<AppTitle text={'Study groups'} />
							<Text
								size="sm"
								color="dimmed"
							>
								Find new words, track your progress and share
								your journey with friends in public and private
								study groups.
							</Text>
						</Stack>
						{!studyGroups ||
						filteredStudyGroups?.length === 0 ? null : (
							<CreateGroupButton />
						)}
					</Group>
					<Stack>
						<PendingInvites />
						<Group>
							<GroupSearch
								search={search}
								setSearch={setSearch}
							/>
						</Group>
						<div>
							<SegmentedControl
								data={[
									{ label: 'All', value: 'all' },
									{ label: 'Your groups', value: 'yours' },
									{ label: 'Public Groups', value: 'public' },
								]}
								value={filter}
								onChange={val =>
									setFilter(val as SegementedValues)
								}
							/>
						</div>
					</Stack>
					<Stack
						justify={'center'}
						align={
							!studyGroups || filteredStudyGroups?.length === 0
								? 'center'
								: 'start'
						}
					>
						{!studyGroups || filteredStudyGroups?.length === 0 ? (
							<StudyGroupEmpty search={search} />
						) : (
							<GroupGrid groups={filteredStudyGroups} />
						)}
					</Stack>
					<LoadingOverlay visible={isLoading} />
				</Stack>
			</Layout>
		</div>
	);
}

export default StudyGroupPage;

export const getServerSideProps = async ({
	req,
	res,
}: GetServerSidePropsContext) => {
	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false,
			},
		};
	}

	return {
		props: {
			session: { ...session, user: transformMockedData(session.user) },
		},
	};
};
