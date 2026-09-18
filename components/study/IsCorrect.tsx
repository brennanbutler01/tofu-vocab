import { Alert, MantineColor, Text } from '@mantine/core';
import { BiCheck, BiError } from 'react-icons/bi';

type Props = {
	isCorrect: boolean;
	oldBox: number;
	newBox: number;
};

type Config = {
	icon: JSX.Element;
	message: string;
	color: MantineColor;
};

export const alertConfig = new Map<boolean, Config>([
	[
		false,
		{
			icon: <BiError size={32} />,
			message: 'Incorrect',
			color: 'red',
		},
	],
	[true, { icon: <BiCheck size={32} />, message: 'Correct', color: 'teal' }],
]);

export function IsCorrect({ isCorrect, ...rest }: Props) {
	const config = alertConfig.get(isCorrect) as Config;
	return (
		<Alert
			styles={theme => ({
				body: {
					display: 'flex',
					flexDirection: 'column',
				},
				icon: {
					width: '32px',
					height: '32px',

					[`@media(max-width: ${theme.breakpoints.xs})`]: {
						width: '20px',
						height: '20px',
					},
				},
				title: { marginBottom: 0 },
			})}
			icon={config?.icon}
			color={config.color}
			variant="light"
			radius={'md'}
			title={
				<Text
					size="lg"
					fw={700}
				>
					{config.message}
				</Text>
			}
		>
			<Text
				size="sm"
				color="dimmed"
			>
				Review your answer below or advance to keep studying.
			</Text>
		</Alert>
	);
}
