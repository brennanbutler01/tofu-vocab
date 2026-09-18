import {
	Button,
	Group,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { SetStateAction } from 'react';
import { DuplicateAlert } from './DuplicateAlert';
import { FormValues } from './FlashcardForm';

type Props = {
	isSaving?: boolean;
	form?: UseFormReturnType<FormValues>;
	editing?: boolean;
	hasDuplicates?: boolean;
	setIgnoreDuplicates: React.Dispatch<SetStateAction<boolean>>;
};

export function FormBody({
	isSaving = false,
	form,
	editing = false,
	hasDuplicates = false,
	setIgnoreDuplicates,
}: Props) {
	const handleAlertClose = () => {
		form?.clearErrors();
		setIgnoreDuplicates(true);
	};

	return (
		<Stack>
			<SimpleGrid
				cols={1}
				breakpoints={[{ minWidth: 'sm', cols: 2 }]}
			>
				<TextInput
					label="Front"
					required
					placeholder="before"
					{...form?.getInputProps('card.front')}
				/>

				<TextInput
					label="Back"
					required
					placeholder="truoc"
					{...form?.getInputProps('card.back')}
				/>
			</SimpleGrid>
			<Text
				color="dimmed"
				size="xs"
			>
				Separate values by commas to allow multiples.
			</Text>

			{hasDuplicates && <DuplicateAlert handleClose={handleAlertClose} />}

			<Group
				position="right"
				mt="lg"
			>
				<Button
					type="reset"
					disabled={isSaving}
					variant="default"
				>
					cancel
				</Button>
				<Button
					type="submit"
					loading={isSaving}
					variant="light"
					color="teal"
				>
					{editing ? 'update' : 'create'}
				</Button>
			</Group>
		</Stack>
	);
}
