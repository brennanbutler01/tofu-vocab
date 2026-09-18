import { Box, Container, Stack, useMantineTheme } from '@mantine/core';
import { AppTitle } from '../AppTitle';
import Image from 'next/image';
import { useMediaQuery } from '@mantine/hooks';

export default function GroupFlashcardsEmpty() {
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
					align="center"
					text={'No flashcards match'}
				/>
				<Box maw={450}>
					<Image
						src={'/empty.png'}
						alt="empty"
						width={isXs ? 225 : isSm ? 275 : 350}
						height={isXs ? 175 : 250}
					/>
				</Box>
			</Stack>
		</Container>
	);
}
