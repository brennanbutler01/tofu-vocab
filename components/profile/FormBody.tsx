import { TextInput, Group, Button, SimpleGrid } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { UserFormProps } from './UserForm';

type Props = {
	form: UseFormReturnType<UserFormProps>;
	editing: boolean;
	cancelEditing: () => void;
};

export function FormBody({ form, editing, cancelEditing }: Props) {
	return (
		<>
			<SimpleGrid
				cols={1}
				breakpoints={[{ minWidth: 'sm', cols: 2 }]}
			>
				<TextInput
					readOnly={!editing}
					label="Name"
					{...form.getInputProps('name')}
					radius="md"
					variant={editing ? 'default' : 'unstyled'}
				/>
				<TextInput
					label="Email"
					{...form.getInputProps('email')}
					readOnly
					variant={'unstyled'}
					radius="md"
				/>
			</SimpleGrid>

			{editing && (
				<Group position="right">
					<Button
						type="reset"
						variant="default"
					>
						cancel
					</Button>
					<Button
						variant="light"
						type="submit"
					>
						confirm
					</Button>
				</Group>
			)}
		</>
	);
}
