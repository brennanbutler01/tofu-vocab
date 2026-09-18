import { Badge } from '@mantine/core';
import { IoMdGlobe } from 'react-icons/io';
import { MdPrivateConnectivity } from 'react-icons/md';

type Props = { visibility: 'public' | 'private' };

export default function IsPublic({ visibility }: Props) {
	const config = {
		public: {
			text: 'Public',
			color: 'teal',
			icon: <IoMdGlobe data-testid="public icon" />,
		},
		private: {
			text: 'Private',
			color: 'pink',
			icon: <MdPrivateConnectivity data-testid="private icon" />,
		},
	};
	return (
		<Badge
			color={config[visibility]?.color}
			radius="md"
			leftSection={config[visibility]?.icon}
			styles={theme => ({
				leftSection: { display: 'flex', alignItems: 'center' },
			})}
		>
			{config[visibility]?.text}
		</Badge>
	);
}
