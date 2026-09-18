import { Box, Container, Stack, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FlashcardOrigins, FlashcardSources } from '@prisma/client';
import Image from 'next/image';
import { AppTitle } from '../AppTitle';
import ConfigureSource from '../study/ConfigureSource';
import { CreateFlashcardButton } from './CreateButton';

type Props = {
	searching: boolean;
	source?: FlashcardSources;
	onSourceChange?: () => void;
};

export function FlashcardsEmpty({ searching, source, onSourceChange }: Props) {
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
					text={
						searching || (source && source !== 'ALL')
							? 'No flashcards match'
							: 'No flashcards'
					}
				/>
				<CreateFlashcardButton
					source={source || 'ALL'}
					origin={FlashcardOrigins.USER}
				/>
				<Box maw={450}>
					<Image
						src={'/empty.png'}
						alt="empty"
						width={isXs ? 250 : isSm ? 350 : 425}
						height={isXs ? 200 : 300}
					/>
				</Box>
				{source && source !== 'ALL' && onSourceChange ? (
					<ConfigureSource
						onSourceChange={onSourceChange}
						center
					/>
				) : null}
			</Stack>
		</Container>
	);
}
