import { Box, Container, Stack, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';
import { AppTitle } from '../AppTitle';
import CreateGroupButton from './CreateGroupButton';

type Props = { search: string };

export default function StudyGroupEmpty({ search }: Props) {
	const theme = useMantineTheme();
	const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
	const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
	return (
		<Container>
			<Stack
				spacing="xs"
				align="center"
			>
				<AppTitle
					order={2}
					align="center"
					text={
						search
							? 'No study groups match search'
							: 'No study groups'
					}
				/>
				<CreateGroupButton />
				<Box maw={450}>
					<Image
						src={'/empty.png'}
						alt="empty"
						width={isXs ? 225 : isSm ? 325 : 400}
						height={isXs ? 175 : 275}
					/>
				</Box>
			</Stack>
		</Container>
	);
}
