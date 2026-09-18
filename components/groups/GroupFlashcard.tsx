import { Input, TransferList } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { GroupForm } from './GroupForm';

type Props = {
	form: UseFormReturnType<GroupForm>;
};

export default function GroupFlashcard({ form }: Props) {
	return (
		<Input.Wrapper
			label="Flashcards"
			p="lg"
		>
			<TransferList
				{...form.getInputProps('flashcards')}
				placeholder="No flashcards"
				searchPlaceholder="Search..."
				nothingFound="Nothing found"
				titles={['Available', 'Selected']}
			/>
		</Input.Wrapper>
	);
}
