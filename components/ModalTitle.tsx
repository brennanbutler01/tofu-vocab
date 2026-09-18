import { Text, useMantineTheme } from '@mantine/core';

//title components for modal
type Props = { text: string };

export function ModalTitle({ text }: Props) {
	const theme = useMantineTheme();
	return (
		<Text
			component="span"
			ff={theme.headings.fontFamily}
			size="xl"
			fw={700}
		>
			{text}
		</Text>
	);
}
