import { Flex, Radio, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { StudySides } from '@prisma/client';
import { UserFormProps } from './UserForm';

type Props = {
	form?: UseFormReturnType<UserFormProps>;
	editing: boolean;
};

export function SideRadio({ form, editing }: Props) {
	return (
		<Radio.Group
			role="radiogroup"
			aria-label="Preferred flashcard side to see"
			name="studySide"
			inputWrapperOrder={['label', 'input', 'description']}
			label="Preferred flashcard side to see"
			description={
				<Flex
					mt="xs"
					direction={'column'}
					gap={'xs'}
				>
					<Text>
						This is the side of the flashcard that you will see when
						you study.
					</Text>
					<Text>
						The other side will be hidden until after you answer.
					</Text>
				</Flex>
			}
			{...form?.getInputProps('studySide')}
		>
			<Radio
				value={StudySides.FRONT}
				label="Front"
				disabled={!editing}
			/>
			<Radio
				mt={'xs'}
				value={StudySides.BACK}
				label="Back"
				disabled={!editing}
			/>
		</Radio.Group>
	);
}
