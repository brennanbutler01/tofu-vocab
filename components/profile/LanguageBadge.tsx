import { Badge } from '@mantine/core';
import { Languages } from '@prisma/client';
import ReactCountryFlag from 'react-country-flag';

type Props = {
	language: Languages;
};

const config = {
	[Languages.ENGLISH]: {
		icon: (
			<ReactCountryFlag
				countryCode="US"
				title="US Flag"
			/>
		),
		name: 'English',
		color: 'blue',
	},
	[Languages.VIETNAMESE]: {
		icon: (
			<ReactCountryFlag
				countryCode="VN"
				title="Vietnamese Flag"
			/>
		),
		name: 'Vietnamese',
		color: 'red',
	},
};
export function LanguageBadge({ language }: Props) {
	console.log('this is the language', language);
	return (
		<Badge
			leftSection={config[language]?.icon}
			color={config[language]?.color}
		>
			{config[language]?.name}
		</Badge>
	);
}
