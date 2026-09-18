import { Group, TextInput } from '@mantine/core';

import { BiSearch } from 'react-icons/bi';

type Props = { value: string; onChange: (val: string) => void };

export function FlashcardSearch({ value, onChange }: Props) {
	return (
		<Group role="search">
			<TextInput
				type={'search'}
				value={value}
				onChange={e => onChange(e.target.value)}
				rightSection={<BiSearch aria-label="search icon" />}
				placeholder="xin chao..."
				label="Search for flashcards"
				labelProps={{ mb: '5px', size: 'xs' }}
			/>
		</Group>
	);
}
