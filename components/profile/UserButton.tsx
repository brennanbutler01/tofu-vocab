import { ActionIcon, Menu } from '@mantine/core';
import { MdSettings } from 'react-icons/md';

type Props = {
	setEditing: () => void;
};

export function UserButton({ setEditing }: Props) {
	return (
		<Menu shadow={'lg'}>
			<Menu.Target>
				<ActionIcon
					size="xl"
					variant="light"
					title="Settings"
				>
					<MdSettings size={32} />
				</ActionIcon>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Item onClick={setEditing}>Edit profile</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
}
