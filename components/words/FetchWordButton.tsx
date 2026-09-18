import { Button } from '@mantine/core';
import { BiRefresh } from 'react-icons/bi';
import { SWRMutationConfiguration } from 'swr/mutation';
import { IAPIGetWordResponse } from 'words/get';

type Props = { trigger: () => Promise<unknown> };

export default function FetchWordButton({ trigger }: Props) {
	return (
		<Button
			onClick={() => {
				void trigger();
			}}
			variant="light"
			leftIcon={<BiRefresh />}
			radius="md"
		>
			Fetch new word
		</Button>
	);
}
