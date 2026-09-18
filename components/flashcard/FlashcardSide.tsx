import { Stack, Text } from '@mantine/core';

type Props = { side: 'front' | 'back'; value: string[] };

//TODO see if we can use a list
export function FlashcardSide({ side, value }: Props) {
	return (
		<Stack>
			<Text size="lg">{side.toLocaleUpperCase()}:</Text>
			<Text color="dimmed">{value.join(', ')}</Text>
		</Stack>
	);
}
