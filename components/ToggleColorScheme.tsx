import {
	Group,
	ActionIcon,
	Text,
	useMantineColorScheme,
	Menu,
} from '@mantine/core';
import { BiSun, BiMoon } from 'react-icons/bi';

export default function ToggleColorScheme() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	return (
		<Menu.Item
			closeMenuOnClick={false}
			component="span"
		>
			<Group position="center">
				<Text size="xs">{colorScheme} mode</Text>
				<ActionIcon
					onClick={() => toggleColorScheme()}
					size="lg"
					name="color-scheme"
					sx={theme => ({
						backgroundColor:
							theme.colorScheme === 'dark'
								? theme.colors.dark[6]
								: theme.colors.gray[0],
						color:
							theme.colorScheme === 'dark'
								? theme.colors.yellow[4]
								: theme.colors.blue[6],
					})}
				>
					{colorScheme === 'dark' ? (
						<BiSun
							size={18}
							data-test-id={'dark-icon'}
						/>
					) : (
						<BiMoon
							size={18}
							data-test-id={'light-icon'}
						/>
					)}
				</ActionIcon>
			</Group>
		</Menu.Item>
	);
}
