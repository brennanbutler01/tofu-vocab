import {
	TextInput,
	Group,
	Button,
	MediaQuery,
	ButtonProps,
	Grid,
	TextInputProps,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { AnwswerValues } from './StudyForm';

type Props = {
	form?: UseFormReturnType<AnwswerValues>;
};
export function StudyFormBody({ form }: Props) {
	const inputProps: TextInputProps = {
		label: 'Answer',
		...form?.getInputProps('answer'),
		placeholder: 'Your answer',
		description: 'Provide the answer in Vietnamese',
		radius: 'md',
		required: true,
		autoComplete: 'false',
	};

	const resetProps: ButtonProps = {
		type: 'reset',
		variant: 'default',
		radius: 'sm',
	};
	const submitProps: ButtonProps = {
		type: 'submit',
		variant: 'light',
		color: 'teal',
		radius: 'sm',
	};

	return (
		<Grid>
			<Grid.Col
				span={12}
				xs={6}
			>
				<MediaQuery
					smallerThan={'lg'}
					styles={{ display: 'none' }}
				>
					<TextInput
						{...inputProps}
						size="lg"
					/>
				</MediaQuery>
				<MediaQuery
					largerThan={'lg'}
					styles={{ display: 'none' }}
				>
					<TextInput
						{...inputProps}
						size="md"
					/>
				</MediaQuery>
			</Grid.Col>
			<Grid.Col
				span={12}
				xs={6}
				mt="md"
			>
				<Group
					align={'end'}
					h={'100%'}
					position="right"
					noWrap
				>
					<MediaQuery
						smallerThan={'lg'}
						styles={{ display: 'none' }}
					>
						<Button
							{...resetProps}
							size="lg"
						>
							{' '}
							Reset
						</Button>
					</MediaQuery>

					<MediaQuery
						largerThan={'lg'}
						styles={{ display: 'none' }}
					>
						<Button {...resetProps}>Reset</Button>
					</MediaQuery>

					<MediaQuery
						smallerThan={'lg'}
						styles={{ display: 'none' }}
					>
						<Button
							{...submitProps}
							size="lg"
						>
							Submit
						</Button>
					</MediaQuery>
					<MediaQuery
						largerThan={'lg'}
						styles={{ display: 'none' }}
					>
						<Button {...submitProps}>Submit</Button>
					</MediaQuery>
				</Group>
			</Grid.Col>
		</Grid>
	);
}
