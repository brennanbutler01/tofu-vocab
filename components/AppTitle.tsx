import { createStyles, Title, TitleProps } from '@mantine/core';

type Props = {
	text: string;
};

const styles = createStyles(theme => ({
	text: {
		fontWeight: theme.colorScheme === 'dark' ? 700 : 900,
	},
}));

export function AppTitle({ text, ...rest }: Props & TitleProps) {
	const { classes } = styles();
	return (
		<Title
			className={classes.text}
			{...rest}
		>
			{text}
		</Title>
	);
}
