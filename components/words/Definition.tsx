import { Accordion, Box, Text } from '@mantine/core';
import { IAPIGetWordResponse } from 'words/get';

type Props = { definition: IAPIGetWordResponse['definition'] };

export function Definition({ definition }: Props) {
	const definitions = Array.isArray(definition)
		? definition[0]?.meanings?.reduce<Record<string, string>>(
				(acc, curr) => {
					return {
						...acc,
						[curr.partOfSpeech]: curr.definitions[0]?.definition,
					};
				},
				{},
		  )
		: undefined;

	return (
		<Box mt="lg">
			Definitions
			<Accordion>
				{definitions
					? Object.entries(definitions).map(([key, value]) => (
							<Accordion.Item
								value={key}
								key={key}
							>
								<Accordion.Control> {key}</Accordion.Control>
								<Accordion.Panel>
									<Text
										size="sm"
										color="dimmed"
									>
										{value}
									</Text>
								</Accordion.Panel>
							</Accordion.Item>
					  ))
					: null}
			</Accordion>
		</Box>
	);
}
