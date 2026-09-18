import { Title, useMantineTheme } from '@mantine/core';

//title components for modal
type Props = { text: string };

export function ModalTitle({ text }: Props) {
	const theme = useMantineTheme();
	return (
		<Title
			ff={theme.headings.fontFamily}
			order={2}
		>
			{text}
		</Title>
	);
}
