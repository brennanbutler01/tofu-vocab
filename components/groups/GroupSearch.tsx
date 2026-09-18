import { TextInput } from '@mantine/core';
import { BiSearch } from 'react-icons/bi';

type Props = {
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function GroupSearch({ search, setSearch }: Props) {
	return (
		<TextInput
			value={search}
			onChange={e => setSearch(e.currentTarget.value)}
			type={'search'}
			radius="md"
			icon={<BiSearch />}
			placeholder="Search groups..."
			label="Search groups"
		/>
	);
}
