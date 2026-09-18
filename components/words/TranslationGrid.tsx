import { Box, createStyles, Divider, Flex, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

type Props = { word?: string; translation?: string };

const styles = createStyles(theme => ({
	languageTitle: {
		fontFamily: theme.headings.fontFamily,
		fontWeight: 300,
		fontSize: theme.fontSizes.xl,
	},
}));

export default function TranslationGrid({ word, translation }: Props) {
	const { classes, theme } = styles();
	const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

	return (
		<Box
			sx={theme => ({
				borderBottom: `1px solid ${theme.colors.gray[3]}`,
				paddingBottom: theme.spacing.xl,
			})}
		>
			<Flex
				justify={'space-evenly'}
				direction={isXs ? 'column' : 'row'}
			>
				<div>
					<p className={classes.languageTitle}>English</p>
					<Text color="dimmed">{word}</Text>
				</div>

				<Divider
					orientation={isXs ? 'horizontal' : 'vertical'}
					mt="lg"
				/>

				<div>
					<p className={classes.languageTitle}>Vietnamese</p>

					<Text color="dimmed">{translation}</Text>
				</div>
			</Flex>
		</Box>
	);
}
